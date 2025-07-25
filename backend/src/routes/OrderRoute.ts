import express from "express";
import {
  createOrder,
  getAllOrders,
  payOrderHandler,
} from "../controllers/OrderController";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.post("/pay", payOrderHandler);

// NEW: Fetch normal order by ID
router.get("/:orderId", (req, res) => {
  const { orderId } = req.params;

  // Replace with real DB query if needed
  if (orderId === "demoorderid1234567890123456") {
    return res.json({
      _id: "demoorderid1234567890123456",
      restaurantId: "fake-restaurant-id",
      collectionPoint: "Demo Collection Point",
      totalCost: 25,
      participants: [],
      status: "open",
      createdAt: new Date().toISOString(),
      isOpenOrder: false,
    });
  }

  return res.status(404).json({ message: "Order not found" });
});

export default router;
