# Noom

Zoom Clone using NodeJS, WebRTC and Websockets.

#Day1 issue 20211227

1. "ws": "^8.4.0" version convey buffer blob instead of the string. To manage this data into the string message, we need to use toString method with utf-8 encoding.

socket.on("message", (message) => {
console.log(message.toString("utf-8"));
sockets.forEach(aSocket => aSocket.send(message.toString()));
});

2. codesandbox requires WSS (Web Socket Secure) to higher the security bar

3. Switch case clause to triage the input types
   Make sure to put break and also set default to prevent any error.
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
