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
    const { orderId, userId, name, items, amountOwed } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const order = await OpenOrder.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Open order not found" });
    }

    // Find participant safely
    const participantIndex = order.participants.findIndex(
      (p) => p.userId && p.userId.toString() === userId
    );

    if (participantIndex !== -1) {
      const participant = order.participants[participantIndex];
      if (participant) {
        participant.items = items || [];
        participant.amountOwed = amountOwed || 0;
      }
    } else {
      order.participants.push({ userId, name, items, amountOwed });
    }

    // In-place remove broken participants
    for (let i = order.participants.length - 1; i >= 0; i--) {
      const participant = order.participants[i];
      if (!participant || !participant.userId) {
        order.participants.splice(i, 1);
      }
    }

    await order.save();

    return res.status(200).json({ message: "Joined open order", order });
  } catch (err) {
    console.error("JOIN ERROR:", err);
    return res
      .status(500)
      .json({ message: "Failed to join open order", error: err });
  }
};
