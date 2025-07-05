import express from "express";
import {
  createOpenOrder,
  getAllOpenOrders,
  joinOpenOrder,
  getOpenOrderById,
} from "../controllers/OpenOrderController";

const router = express.Router();

router.post("/", createOpenOrder);
router.get("/", getAllOpenOrders);
router.get("/:orderId", getOpenOrderById);
router.post("/join", joinOpenOrder);

export default router;
