const express = require("express");
const http = require("http");
const cors = require("cors");

const { initWebSocket } = require("./websocket");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://chat-app-practice.netlify.app"],
  }),
);
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Websocket chat server running");
});

const server = http.createServer(app);

initWebSocket(server);

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
