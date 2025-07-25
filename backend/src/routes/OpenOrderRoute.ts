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

// 👇 MOVE THIS ABOVE THE dynamic `/:orderId` route
router.get("/demoopenorderid123456789012345", (_req, res) => {
  res.json({
    data: {
      _id: "demoopenorderid123456789012345",
      restaurantName: "Demo Sushi Place",
      totalCost: 12.99,
      deliveryLocation: "Demo Location",
      host: "Demo Host",
      isClosed: false,
      participants: [],
      createdAt: new Date().toISOString(),
      isOpenOrder: true,
    },
  });
});

router.get("/:orderId", getOpenOrderById);
router.post("/join", joinOpenOrder);
router.delete("/:orderId/leave", leaveOpenOrder);

export default router;
