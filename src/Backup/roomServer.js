import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

/* 
//Stage 2 Rooms using Socket.io 
function publicRooms() {
	const {
		sockets: {
			adapter: { sids, rooms },
		},
	} = wsServer;
	const publicRooms = [];
	rooms.forEach((_, key) => {
		if (sids.get(key) === undefined) {
			publicRooms.push(key);
		}
	});
	return publicRooms;
}

function countRoom(roomName) {
	return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
	if (!socket["nickname"]) {
		socket["nickname"] = "Anonymous";
	}
	wsServer.sockets.emit("room_change", publicRooms());
	socket.onAny((event) => {
		console.log(`Socket Event: ${event} by ${socket.nickname}`);
	});
	socket.on("enter_room", (roomName, done) => {
		socket.join(roomName);
		done();
		socket.emit("welcome", socket.nickname, countRoom(roomName));
		wsServer.sockets.emit("room_change", publicRooms());
		//to all sockets
	});
	socket.on("disconnecting", () => {
		socket.rooms.forEach((room) =>
			socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1),
		);
	});
	socket.on("disconnect", () => {
		wsServer.sockets.emit("room_change", publicRooms());
	});
	socket.on("new_message", (msg, room, done) => {
		socket.to(room).emit("new_message", msg, socket.nickname);
		done();
	});
	socket.on("set_nickname", (newNickname, done) => {
		socket["nickname"] = newNickname;
		done();
	});
}); */

//#stage 1 - Chat using WebSocket

/* const sockets = [];

wss.on("connection", (socket) => {
	sockets.push(socket); //list of the sockets connected to this server
	socket["nickname"] = "Anonymous";

	console.log("Connected to Browser ✅");
	socket.on("close", () => console.log("Disconnected from the Browser ❌"));

	socket.on("message", (msg) => {
		const messageUTF8 = msg.toString("utf-8");
		const messageString = JSON.parse(messageUTF8);
		switch (messageString.type) {
			case "new_message":
				sockets.forEach((aSocket) =>
					aSocket.send(`${socket.nickname}: ${messageString.payload}`),
				);
				console.log("server side message", messageString.payload);
				break;
			case "nickname":
				socket["nickname"] = messageString.payload;
				break;
			default:
				console.log("No socket message available");
		}
	});
}); */

httpServer.listen(3000, handleListen);
