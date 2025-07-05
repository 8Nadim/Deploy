import { Request, Response } from "express";
import mongoose from "mongoose";
import OpenOrder from "../models/OpenOrder";

// POST /api/open-orders — create an open order

export const createOpenOrder = async (req: Request, res: Response) => {
  try {
    console.log("Incoming open order data (demo mode):", req.body);

    const fakeOpenOrder = {
      _id: "demoopenorderid123456789012345",
      restaurantId: "demo_restaurant_id_1234567890",
      items: [{ name: "Demo Sushi", price: 12.99 }],
      totalPrice: 12.99,
      deliveryLocation: "Demo Location",
      host: "Demo Host",
      isClosed: false,
      participants: [],
      createdAt: new Date(),
    };

    return res.status(201).json({
      message: "Open order created",
      data: fakeOpenOrder,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to create open order", error: err });
  }
};

// GET /api/open-orders — get all open orders
export const getAllOpenOrders = async (_req: Request, res: Response) => {
  try {
    const openOrders = await OpenOrder.find().populate("restaurantId");
    return res.json({ data: openOrders });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch open orders", error: err });
  }
};

// GET /api/open-orders/:orderId — get an open order by ID
export const getOpenOrderById = async (req: Request, res: Response) => {
  try {
    const order = await OpenOrder.findById(req.params["orderId"]);
    if (!order) {
      return res.status(404).json({ message: "Open order not found" });
    }
    return res.json({ data: order });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// POST /api/open-orders/join — join an open order
export const joinOpenOrder = async (req: Request, res: Response) => {
  try {
    const { orderId, userId, name, items } = req.body;

    if (!orderId || !userId || !name) {
      return res
        .status(400)
        .json({ message: "Missing orderId, userId, or name" });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid orderId format" });
    }

    const openOrder = await OpenOrder.findById(orderId);
    if (!openOrder) {
      return res.status(404).json({ message: "Open order not found" });
    }

    const amountOwed = Array.isArray(items)
      ? items.reduce((sum, item) => sum + (item.price || 0), 0)
      : 0;

    const existingParticipant = openOrder.participants.find(
      (p) => p.userId.toString() === userId
    );

    if (existingParticipant) {
      existingParticipant.name = name;
      existingParticipant.items = items;
      existingParticipant.amountOwed = amountOwed;
    } else {
      openOrder.participants.push({ userId, name, items, amountOwed });
    }

    await openOrder.save();

    return res
      .status(200)
      .json({ message: "Joined open order", data: openOrder });
  } catch (err) {
    console.error("JOIN ERROR:", err);
    return res.status(500).json({
      message: "Failed to join open order",
      error: (err as Error).message,
    });
  }
};
