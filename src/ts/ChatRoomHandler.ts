let ChatBox = document.getElementById("ChatBox");
let temp = document.getElementsByTagName("template")[0];

function addMessage(shortname: string, timestamp: string, message: string): void {

    let clone = temp.content.cloneNode(true) as DocumentFragment;
    clone.querySelector("#ShortName")!.innerHTML = shortname;
    clone.querySelector("#Timestamp")!.innerHTML = timestamp;
    clone.querySelector("#Message")!.innerHTML = message;
    if (ChatBox) {
        ChatBox.appendChild(clone);
    }
}

// Some testing messages
addMessage("Maia","10:02","Hello World!");
addMessage("Strg","11:52","Hello Maia!");

// Dynamic hostname allows this code to work in dev
let hostname = window.location.host;

// Client side initiates a websocket connection
function join() {
    const wss = document.location.protocol === "http:" ? "ws://" : "wss://";
    let ws = new WebSocket(wss + hostname + "/api/mesh-messages");

    ws.addEventListener("message", event => {
        console.log(event.data);
        let data = JSON.parse(event.data);
        addMessage(data.shortname,data.timestamp,data.message);
    });

    ws.addEventListener("error", event => {
        console.log("WebSocket error, reconnecting:", event);
        join();
    });


    ws.addEventListener("open", event => {
        let data = {name: "Echo", timestamp: "15:35", message:"Echoes to you"};
        ws.send("Hello socket!");
    });
}
join();