import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";
import openOrderRoute from "./routes/OpenOrderRoute";

mongoose
  .connect(process.env["MONGODB_CONNECTION_STRING"] as string)
  .then(() => console.log("Connected to database"));

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

app.use("/api/open-order", openOrderRoute);
app.listen(7000, () => {
  console.log("server started on localhost:7000");
});
