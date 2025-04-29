import express from "express";
import {
  createOpenOrder,
  getAllOpenOrders,
  joinOpenOrder,
} from "../controllers/OpenOrderController";

const router = express.Router();

router.post("/", createOpenOrder);
router.get("/", getAllOpenOrders);
router.post("/open-order/join", joinOpenOrder);
export default router;
