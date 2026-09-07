import { string } from "astro:schema";

let ChatBox = document.getElementById("ChatBox");
let temp = document.getElementsByTagName("template")[0];

function addMessage(shortname: string, unixTimestamp: number, message: string, append: boolean): void {
    let localTime = new Date(unixTimestamp * 1000).toLocaleString();

    let clone = temp.content.cloneNode(true) as DocumentFragment;
    clone.querySelector("#ShortName")!.innerHTML = shortname;
    clone.querySelector("#Timestamp")!.innerHTML = localTime;
    clone.querySelector("#Message")!.innerHTML = message;
    if (!ChatBox) {
        return;
    }
    if (append) {
        ChatBox.insertBefore(clone, ChatBox.lastChild);
    } else {
        ChatBox.insertBefore(clone, ChatBox.firstChild);
    }
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
 * @param {number} offset - The offset for the messages to fetch e.g. 0 for the latest messages, 1 for the next page, etc
 */
async function receiveLatestMessages(offset: number): Promise<void> {
    try {
        const response = await fetch(`/api/receive-mesh-message?offset=${offset}`);
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const result: Array<MeshMessage> = await response.json();
    result.reverse();

    for (let message of result) {
        console.log(message);
        // Append if retrieving historical messages
        const shouldAppend = offset != 0;
        addMessage(message.nodeID, message.rxTimestamp, message.message, shouldAppend);
    }

  } catch (error:any) {
    console.error(error.message);
  }

  
}

// Load messages first to prevent the infinite scroll observer from activating prematurely
await receiveLatestMessages(0);
join();

// Infinite scrolling logic
const options = {
  root: ChatBox,
};
// Keep track of each block of messages as a 'page'
let current_page = 1;
const observer = new IntersectionObserver(
    function(entries: IntersectionObserverEntry[]) {
        // Prevent multiple simultaneous events from loading multiple pages
        let loading = false;
        entries.forEach((entry) => {
            if (entry.isIntersecting && !loading) {
                receiveLatestMessages(current_page);
                current_page++;
                console.log("New page requested: " + current_page);
                loading = true;
            }
        })
        loading = false;
    }, options);

const loading_marker = document.getElementById("loading-marker") as HTMLElement;
observer.observe(loading_marker);