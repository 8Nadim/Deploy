import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";
import openOrderRoute from "./routes/OpenOrderRoute";

console.log("[server] Starting up...");

mongoose
  .connect(process.env["MONGODB_CONNECTION_STRING"] as string)
  .then(() => console.log("[server] Connected to database"))
  .catch((err) => console.error("[server] DB connection error:", err));

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/my/user", myUserRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/orders", orderRoute);
app.use("/api/open-orders", openOrderRoute);

const PORT = 7000;
app.listen(PORT, () => {
  console.log(`[server] Server started on http://localhost:${PORT}`);
});
