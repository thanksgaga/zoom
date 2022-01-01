const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");
const call = document.getElementById("call");

//video call feature
call.hidden = true;

let myStream;
let cameraOff = false;
let muted = false;
let myPeerConnection;

async function getCameras() {
	try {
		const devices = await navigator.mediaDevices.enumerateDevices();
		const cameras = devices.filter((device) => device.kind === "videoinput");
		const currentDevice = myStream.getVideoTracks()[0];
		cameras.forEach((camera) => {
			const option = document.createElement("option");
			option.value = camera.deviceId;
			option.innerText = camera.label;
			if (camera.label === currentDevice.label) {
				option.selected = true;
			}
			cameraSelect.appendChild(option);
		});
	} catch (e) {
		console.log(e);
	}
}
async function getMedia(deviceId) {
	const initialConstrains = {
		audio: !muted,
		video: { facingMode: "user" },
	};
	const cameraConstraints = {
		audio: !muted,
		video: { deviceId: { exact: deviceId } },
	};
	try {
		myStream = await navigator.mediaDevices.getUserMedia(
			deviceId ? cameraConstraints : initialConstrains,
		);
		myFace.srcObject = myStream;
		if (!deviceId) {
			await getCameras();
		}
	} catch (e) {
		console.log(e);
	}
}

function handleMuteClick() {
	myStream
		.getAudioTracks()
		.forEach((track) => (track.enabled = !track.enabled));
	if (muted) {
		muteBtn.innerText = "Mute";
		muted = false;
	} else {
		muteBtn.innerText = "Unmute";
		muted = true;
	}
}
function handleCameraClick() {
	myStream
		.getVideoTracks()
		.forEach((track) => (track.enabled = !track.enabled));

	if (cameraOff) {
		cameraBtn.innerText = "Camera Off";
		cameraOff = false;
	} else {
		cameraBtn.innerText = "Camera On";
		cameraOff = true;
	}
}
async function handleCameraChange() {
	await getMedia(cameraSelect.value);
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("change", handleCameraChange);

//welcome room enter part
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");
let roomName;
async function initMedia() {
	welcome.hidden = true;
	call.hidden = false;
	await getMedia();
	makeConnection();
}
async function handleWelcomeSubmit(event) {
	event.preventDefault();
	const input = welcomeForm.querySelector("input");
	roomName = input.value;
	await initMedia();
	socket.emit("join_room", roomName);
	input.value = "";
}
welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket
socket.on("welcome", async () => {
	console.log("someon joined");
	const offer = await myPeerConnection.createOffer();
	myPeerConnection.setLocalDescription(offer);
	console.log("sent the offer");
	socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer) => {
	myPeerConnection.setRemoteDescription(offer);
	const answer = await myPeerConnection.createAnswer();
	myPeerConnection.setLocalDescription(answer);
	socket.emit("answer", answer, roomName);
});

socket.on("answer", (answer) => {
	myPeerConnection.setRemoteDescription(answer);
});

// RTC Code
function makeConnection() {
	myPeerConnection = new RTCPeerConnection();
	myStream
		.getTracks()
		.forEach((track) => myPeerConnection.addTrack(track, myStream));
}
