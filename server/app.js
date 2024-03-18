const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const app = express();
const http = require("http");
const server = http.createServer(app);

const dbConnect = require("./db/dbconnect");
const authRoutes = require("./routes/auth");
const feedRoutes = require("./routes/feed");
const goalRoutes = require("./routes/goal");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const categoryRoutes = require("./routes/category");
const messageRoutes = require("./routes/message");

const io = new Server(server, {
  cors: { origin: "*" },
  reconnectionAttempts: 5,
});

dbConnect();
app.use(bodyParser.json());

const crossOrigin = require("./utils/crossOrigin");
const errorMiddleware = require("./middleware/errorMiddleware");

//to view the file as static file
app.use(express.static(path.resolve(__dirname, "./uploads")));

app.use(crossOrigin);
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/goal", goalRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/category", categoryRoutes);
app.use("/message", messageRoutes);

io.on("connection", (socket) => {
  console.log("connected to socket", socket.id);
  socket.on("setup", (contectedUser) => {
    socket.join(contectedUser._id);
    // console.log(contectedUser._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    // console.log("Incoming message:", newMessageRecieved);

    const chat = newMessageRecieved.chatId;
    if (!chat) {
      // console.log("Chat ID not defined");
      return;
    }

    const receiverId = chat.ReciverId._id;
    const senderId = chat.senderId._id;
    const messageSenderId = newMessageRecieved.messageSender._id;

    if (receiverId !== messageSenderId) {
      // console.log("Emitting message to receiver:", receiverId);
      socket.to(receiverId).emit("message received", newMessageRecieved);
    }

    if (senderId !== messageSenderId) {
      // console.log("Emitting message to sender:", senderId);
      socket.to(senderId).emit("message received", newMessageRecieved);
    }
  });
});

app.use(errorMiddleware);

// Function to start the server
function startServer(port) {
  if (port > 65535) {
    console.error("No available ports in the valid range.");
    return;
  }

  server
    .listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${port} is already in use, trying next port...`);
        startServer(port + 1);
      } else {
        console.error(err);
      }
    });
}

// Start server
const PORT = process.env.PORT || 8080;
startServer(PORT);
