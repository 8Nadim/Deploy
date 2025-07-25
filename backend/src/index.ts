import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";
import openOrderRoute from "./routes/OpenOrderRoute";
import http from "http";
import { Server } from "socket.io";

console.log("[server] Starting up...");

// Connect to MongoDB
mongoose
  .connect(process.env["MONGODB_CONNECTION_STRING"] as string)
  .then(() => console.log("[server] Connected to database"))
  .catch((err) => console.error("[server] DB connection error:", err));

const app = express();

// CORS setup
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);

app.use(express.json());

// API routes
app.use("/api/my/user", myUserRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/orders", orderRoute);
app.use("/api/open-orders", openOrderRoute);

// Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("[socket] New connection:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`[socket] ${socket.id} joined room ${roomId}`);
  });

  socket.on("chat-message", ({ roomId, name, message }) => {
    io.to(roomId).emit("chat-message", { name, message });
  });

  socket.on("disconnect", () => {
    console.log("[socket] Disconnected:", socket.id);
  });
});

const PORT = 7000;
server.listen(PORT, () => {
  console.log(`[server] Server started on http://localhost:${PORT}`);
});
