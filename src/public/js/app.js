const socket = io();

const welcome = document.getElementById("welcome");
const roomForm = welcome.querySelector("form");

function backendDone(msg) {
	console.log(`The backend says:`, msg);
}

function handleRoomSubmit(event) {
	event.preventDefault();
	const input = roomForm.querySelector("input");
	socket.emit("enter_room", input.value, backendDone);
	input.value = "";
}

roomForm.addEventListener("submit", handleRoomSubmit);
