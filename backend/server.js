const app = require('./app');
const connectDatabase = require("./db/Database");
const { Server } = require("socket.io");

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server for handling uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: ".env",
  });
}

// connect db
connectDatabase();

// create server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT}`
  );
});

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("addUser", (userId) => {
    const user = { userId, socketId: socket.id };
    const exists = onlineUsers.some((u) => u.userId === userId);
    if (!exists && userId) {
      onlineUsers.push(user);
    }
    io.emit("getUsers", onlineUsers);
  });

  socket.on("sendMessage", (data) => {
    const user = onlineUsers.find((u) => u.userId === data.receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        sender: data.senderId,
        text: data.text,
        images: data.images,
      });
    }
  });

  socket.on("updateLastMessage", (data) => {
    const user = onlineUsers.find((u) => u.userId === data.lastMessageId);
    if (user) {
      io.to(user.socketId).emit("getLastMessage", data);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);
    io.emit("getUsers", onlineUsers);
  });
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`Shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});