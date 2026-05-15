const http = require("http");
const app = require("./src/config/express.config");
const { Server } = require("socket.io");
const messageModel = require("./src/module/chat/message.model");

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("USER CONNECTED:", socket.id);

  socket.emit("test_event", "hello from server");

  socket.on("send_message", async (data) => {
    console.log("Incoming message:", data);

    const msg = await messageModel.create(data);
    console.log("Saved message:", msg);

    io.emit("receive_message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 9009;

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
