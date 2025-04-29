import { Request, Response } from "express";
import OpenOrder from "../models/OpenOrder";
import mongoose from "mongoose";

// POST /api/open-order — create an open order
export const createOpenOrder = async (req: Request, res: Response) => {
  try {
    const openOrder = await OpenOrder.create(req.body);
    res.status(201).json(openOrder);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create open order", error: err });
  }
};

// GET /api/open-order — get all open orders
export const getAllOpenOrders = async (_req: Request, res: Response) => {
  try {
    const openOrders = await OpenOrder.find().populate("restaurantId");
    res.json({ data: openOrders });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch open orders", error: err });
  }
};

// POST /api/open-order/join — join an open order
export const joinOpenOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, userId } = req.body;

    // Validate the orderId format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const order = await OpenOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Open order not found" });
    }

    // Check if the user is already a participant
    if (!order.participants.includes(userId)) {
      order.participants.push(userId);
      await order.save();
    }

    return res.status(200).json({ message: "Joined open order", order });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to join open order", error: err });
  }
};
