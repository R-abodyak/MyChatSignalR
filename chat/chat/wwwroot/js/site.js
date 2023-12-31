// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
let connection = null;
var reciverId = ""


setupConnection = () => {
    connection = new signalR.HubConnectionBuilder()
        .withUrl("/ChatHub")
        .build();

    connection.on("ReceiveMessage", (msg,sender,reciverId) => {
        response(msg);
    }
    );

  
    connection.on("finished", function () {
        connection.stop();
    }
    );
    connection.on("connected", (connectionId) => {
        console.log(`Connected with Connection ID: ${connectionId}`);
        updateConnectionIdDisplay(connectionId);
    });

    connection.start()
        .then(() => {
            console.log(`Connected with Connection ID: ${connection.connectionId}`);
            updateConnectionIdDisplay(connection.connectionId);
        })
        .catch(err => console.error(err.toString()));
}

function updateConnectionIdDisplay(connectionId) {
    document.getElementById("connectionIdDisplay").innerText = `Connection ID: ${connectionId}`;
}

setupConnection();
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");


// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const YourFriend = "Your friend";
const You = "you";

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  // Send the message to the server using the SignalR hub method
    connection.invoke("SendMessage", msgText, "SenderName", reciverId)
      .catch(err => console.error(err));
  appendMessage(You, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

});

function appendMessage(name, img, side, text) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function response(msgText) {
    console.log(msgText);
  const delay = msgText.split(" ").length * 100;

  setTimeout(() => {
    appendMessage(YourFriend, BOT_IMG, "left", msgText);
  }, delay);
}

function setFriendConnectionId() {
    reciverId = document.getElementById("friendConnectionIdInput").value;
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}