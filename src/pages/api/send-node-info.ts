export const prerender = false

import type { APIRoute } from "astro";
import { env } from 'cloudflare:workers';
import { MeshMessage, NodeInfo } from "../../Meshtastic";
import type { MeshMessage as MeshMessageType, NodeInfo as NodeInfoType } from "../../Meshtastic";

export const POST = (async ({ request }) => {
  const stub = env.MESHCHAT_SERVER_DO.getByName("foo");
  const body: NodeInfoType = await request.json();
  await stub.writeNodeInfo(body);
  return new Response(JSON.stringify(body), {status:200, headers:{"Content-Type":"application/json"}});
}) satisfies APIRoute;