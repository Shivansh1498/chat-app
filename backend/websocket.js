const WebSocket = require("ws");
const { randomUUID } = require("crypto");

function initWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  const clients = new Set();

  wss.on("connection", (ws) => {
    const userId = randomUUID();

    ws.userId = userId;

    console.log("New client connected:", userId);

    clients.add(ws);

    // Send ID to client
    ws.send(
      JSON.stringify({
        type: "connection",
        userId: userId,
      }),
    );

    ws.on("message", (message) => {
      const text = message.toString();

      console.log(`Received from ${ws.userId}:`, text);

      const payload = JSON.stringify({
        type: "chat",
        userId: ws.userId,
        message: text,
      });

      // broadcast message to all clients
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      });
    });

    ws.on("close", () => {
      console.log("Client disconnected:", ws.userId);
      clients.delete(ws);
    });
  });
}

module.exports = { initWebSocket };
