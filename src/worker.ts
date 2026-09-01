import { handle } from '@astrojs/cloudflare/handler';
import node from 'astro/logger/node';
import { json } from 'astro:schema';
import { DurableObject } from 'cloudflare:workers';

export class MeshChatServer extends DurableObject<Env> {
    sql: SqlStorage;
    constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
    this.sql = ctx.storage.sql;
	}

  async writeNodeInfo(nodeInfo: NodeInfo) {
    this.sql.exec("INSERT INTO nodes (nodeID, shortname, longname) VALUES (?, ?, ?)",
      nodeInfo.nodeID, nodeInfo.shortname, nodeInfo.longname
    );
  }

  /**
   * Get the associated NodeInfo for the given nodeID
   * @param nodeID 
   * @returns the NodeInfo for the nodeID if it exists, otherwise null
   */
  async getNodeInfo(nodeID: string): Promise<NodeInfo|null> {
    const nodeInfo = this.sql.exec("SELECT * FROM nodes WHERE nodeID = ?", nodeID).toArray()[0];
    return (nodeInfo as NodeInfo) ?? null;
  }

  // Return last n messages in ascending order
  async getLastNMessages(n: number) {
    return this.sql.exec("SELECT * FROM messages ORDER BY rxTimestamp LIMIT ?", n).toArray();
  }

  /**
   * Save a message to the DO's SQLite database
   * @param messageBody Expects 'shortname' field to have nodeID in hex form
   */
  async saveMessage(data: MeshMessage) {
    this.sql.exec("INSERT INTO messages (nodeID, rxTimestamp, message) VALUES (?, ?, ?)",
      data.nodeID, data.rxTimestamp, data.message
    );
  }
  // Send a message
  async replicateMessage(body: MeshMessage) {
    let jsonBody = JSON.stringify(body);
    this.ctx.getWebSockets().forEach((webSocket) => {
      webSocket.send(jsonBody);
    });
  }

  async fetch(request: Request) {
    let url = new URL(request.url)

    // Creates two ends of a WebSocket connection.
      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);

      // Calling `acceptWebSocket()` connects the WebSocket to the Durable Object, allowing the WebSocket to send and receive messages.
      // Unlike `ws.accept()`, `state.acceptWebSocket(ws)` allows the Durable Object to be hibernated
      // When the Durable Object receives a message during Hibernation, it will run the `constructor` to be re-initialized
      this.ctx.acceptWebSocket(server);

      return new Response(null, {
          status: 101,
          webSocket: client,
      });
  }

  async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
		// Upon receiving a message from the client, reply with the same message,
		// but will prefix the message with "[Durable Object]: " and return the number of connections.
		ws.send(
      message
		);
    return;
	}
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const upgradeHeader = request.headers.get("Upgrade")?.toLowerCase();
    if (upgradeHeader == "websocket" && url.pathname === "/api/mesh-messages") {
      let id = env.MESHCHAT_SERVER_DO.idFromName("foo");
      let stub = env.MESHCHAT_SERVER_DO.get(id);
      return stub.fetch(request);
    }

    return handle(request, env, ctx);
  },
  async queue(batch, _env) {
    let messages = JSON.stringify(batch.messages);
    console.log(`consumed from our queue: ${messages}`);
  },
} satisfies ExportedHandler<Env>;