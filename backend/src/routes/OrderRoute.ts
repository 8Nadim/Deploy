import express from "express";
import { createOrder, getAllOrders } from "../controllers/OrderController";
import { payOrderHandler } from "../controllers/OrderController";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.post("/pay", payOrderHandler);

router.get("/demoorderid1234567890123456", (_, res) => {
  res.json({
    _id: "demoorderid1234567890123456",
    restaurantId: "fake-restaurant-id",
    host: "Demo Host",
    participants: [],
    totalPrice: 0,
    deliveryLocation: "Demo Street",
    isClosed: false,
    createdAt: new Date().toISOString(),
    isOpenOrder: true,
  });
});

export default router;
