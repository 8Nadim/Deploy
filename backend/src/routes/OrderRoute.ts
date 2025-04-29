import express from "express";
import { createOrder, getAllOrders } from "../controllers/OrderController";
import { joinOpenOrder } from "../controllers/OpenOrderController";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.post("/api/open-order/join", joinOpenOrder);

export { router };
