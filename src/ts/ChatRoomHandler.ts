import { string } from "astro:schema";

let ChatBox = document.getElementById("ChatBox");
let temp = document.getElementsByTagName("template")[0];

function addMessage(shortname: string, unixTimestamp: number, message: string): void {
    let localTime = new Date(unixTimestamp * 1000).toLocaleTimeString();

    let clone = temp.content.cloneNode(true) as DocumentFragment;
    clone.querySelector("#ShortName")!.innerHTML = shortname;
    clone.querySelector("#Timestamp")!.innerHTML = localTime;
    clone.querySelector("#Message")!.innerHTML = message;
    if (!ChatBox) {
        return;
    }
    ChatBox.appendChild(clone);
}

// test message
addMessage("!07339f2b", 1788135928, "Hello World! This is purely a test message and does not come from the mesh.");

// Dynamic hostname allows this code to work in dev
let hostname = window.location.host;

// Client side initiates a websocket connection
function join() {
    const wss = document.location.protocol === "http:" ? "ws://" : "wss://";
    let ws = new WebSocket(wss + hostname + "/api/subscribe-mesh-messages");

    ws.addEventListener("message", event => {
        let data = JSON.parse(event.data);
        addMessage(data.shortname,data.timestamp,data.message);
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
join();