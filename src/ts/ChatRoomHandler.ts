import { string } from "astro:schema";

let ChatBox = document.getElementById("ChatBox");
let temp = document.getElementsByTagName("template")[0];

function addMessage(shortname: string, unixTimestamp: number, message: string): void {
    let localTime = new Date(unixTimestamp * 1000).toLocaleString();

    let clone = temp.content.cloneNode(true) as DocumentFragment;
    clone.querySelector("#ShortName")!.innerHTML = shortname;
    clone.querySelector("#Timestamp")!.innerHTML = localTime;
    clone.querySelector("#Message")!.innerHTML = message;
    if (!ChatBox) {
        return;
    }
    ChatBox.insertBefore(clone, ChatBox.firstChild);
}

// Dynamic hostname allows this code to work in dev
let hostname = window.location.host;

// Client side initiates a websocket connection
function join() {
    const wss = document.location.protocol === "http:" ? "ws://" : "wss://";
    let ws = new WebSocket(wss + hostname + "/api/subscribe-mesh-messages");

    ws.addEventListener("message", event => {
        let data: MeshMessage = JSON.parse(event.data);
        addMessage(data.nodeID,data.rxTimestamp,data.message);
    });

    ws.addEventListener("error", event => {
        // Small timer to delay reconnect attempts
        setTimeout(function() {}, 5000);
        join();
    });


    ws.addEventListener("open", event => {
        // currently does nothing but I may use this to tell the user that a connection has been established
    });
}

/**
 * @throws {Error}
 */
async function receiveLatestMessages(): Promise<void> {
    try {
        const response = await fetch("/api/receive-mesh-message");
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const result: Array<MeshMessage> = await response.json();

    for (let message of result) {
        console.log(message);
        addMessage(message.nodeID, message.rxTimestamp, message.message);
    }

  } catch (error:any) {
    console.error(error.message);
  }

  
}


receiveLatestMessages();
join();