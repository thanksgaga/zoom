const socket = io();

const welcome = document.getElementById("welcome");
const roomForm = welcome.querySelector("form");
const room = document.getElementById("room");

function backendDone(msg) {
	console.log(`The backend says:`, msg);
}
room.hidden = true;
let roomName;

function showRoom() {
	welcome.hidden = true;
	room.hidden = false;
	const h3 = room.querySelector("h3");
	h3.innerText = `You are in the Room ${roomName}`;
	const messageForm = room.querySelector("form");
	messageForm.addEventListener("submit", handleMessageSend);
}

function handleRoomSubmit(event) {
	event.preventDefault();
	const input = roomForm.querySelector("input");
	roomName = input.value;
	socket.emit("enter_room", roomName, showRoom);
	input.value = "";
}

function addMessage(message) {
	const messageList = room.querySelector("ul");
	const li = document.createElement("li");
	li.innerText = message;
	messageList.appendChild(li);
}

function handleMessageSend(event) {
	event.preventDefault();
	const messageInput = room.querySelector("input");
	value = messageInput.value;
	socket.emit("new_message", value, () => {
		addMessage(`You: ${value}`);
	});
	messageInput.value = "";
}
roomForm.addEventListener("submit", handleRoomSubmit);
