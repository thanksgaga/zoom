import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function onSocketClose() {
	console.log("Disconnected from the Browser ❌");
}

const sockets = [];

wss.on("connection", (socket) => {
	sockets.push(socket); //list of the sockets connected to this server
	socket["nickname"] = "Anonymous";

	console.log("Connected to Browser ✅");
	socket.on("close", onSocketClose);

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
});

server.listen(3000, handleListen);
