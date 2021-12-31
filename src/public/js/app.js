const socket = io();

const welcome = document.getElementById("welcome");
const roomForm = welcome.querySelector("form");
const room = document.getElementById("room");
const nickname = document.getElementById("nickname");
const nickForm = nickname.querySelector("form");

room.hidden = true;
nickname.hidden = true;
let roomName;

function showRoom() {
	welcome.hidden = true;
	room.hidden = false;
	nickname.hidden = false;
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
	socket.emit("new_message", value, roomName, () => {
		addMessage(`You: ${value}`);
	});

	messageInput.value = "";
}

function setNickname(event) {
	event.preventDefault();
	const nickInput = nickForm.querySelector("input");
	value = nickInput.value;
	socket.emit("set_nickname", value, () => {
		addMessage(`Your nickname is changed to ${value}`);
	});
}

roomForm.addEventListener("submit", handleRoomSubmit);
nickForm.addEventListener("submit", setNickname);

socket.on("welcome", (nickname, newCount) => {
	const h3 = room.querySelector("h3");
	h3.innerText = `Room ${roomName} (${newCount})`;
	addMessage(`${nickname} is joined`);
});
socket.on("bye", (nicknamem, newCount) => {
	const h3 = room.querySelector("h3");
	h3.innerText = `Room ${roomName} (${newCount})`;
	addMessage(`${nickname} just left ㅠㅠ`);
});
socket.on("new_message", (message, nickname) => {
	addMessage(`${nickname}: ${message}`);
});

socket.on("room_change", (rooms) => {
	const roomList = welcome.querySelector("ul");
	roomList.innerHTML = "";
	rooms.forEach((room) => {
		const li = document.createElement("li");
		li.innerText = room;
		roomList.appendChild(li);
	});
});
