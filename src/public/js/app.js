const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");

const socket = new WebSocket(`ws://${window.location.host}`);

function handleOpen() {
	console.log("Connected to Server ✅");
}
socket.addEventListener("open", handleOpen);

function makeMessage(type, payload) {
	const msg = { type, payload };
	return JSON.stringify(msg);
}

function handleMessage(message) {
	console.log("New message: ", message.data);
	const li = document.createElement("li");
	li.innerText = message.data;
	messageList.append(li);
}

socket.addEventListener("message", handleMessage);

socket.addEventListener("close", () => {
	console.log("Disconnected from Server ❌");
});

function handleSubmit(event) {
	event.preventDefault();
	const input = messageForm.querySelector("input");
	socket.send(makeMessage("new_message", input.value));
	console.log("browser side", input.value);
	input.value = "";
}

function handleNickSubmit(event) {
	event.preventDefault();
	const input = nickForm.querySelector("input");
	socket.send(makeMessage("nickname", input.value));
	input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
