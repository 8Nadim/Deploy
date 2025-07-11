import express from "express";
import {
  createOpenOrder,
  getAllOpenOrders,
  joinOpenOrder,
  getOpenOrderById,
  leaveOpenOrder,
} from "../controllers/OpenOrderController";

const router = express.Router();

router.post("/", createOpenOrder);
router.get("/", getAllOpenOrders);
router.get("/:orderId", getOpenOrderById);
router.post("/join", joinOpenOrder);
router.delete("/:orderId/leave", leaveOpenOrder);

router.get("/demoopenorderid123456789012345", (_req, res) => {
  res.json({
    _id: "demoopenorderid123456789012345",
    restaurantId: "Demo Sushi Place",
    items: [{ name: "Demo Sushi", price: 12.99 }],
    totalPrice: 12.99,
    deliveryLocation: "Demo Location",
    host: "Demo Host",
    isClosed: false,
    participants: [],
    createdAt: new Date().toISOString(),
    isOpenOrder: true,
  });
});

export default router;
