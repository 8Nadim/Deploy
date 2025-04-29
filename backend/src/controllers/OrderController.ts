import { Request, Response } from "express";
import Order from "../models/Order";
import OpenOrder from "../models/OpenOrder";

// POST /api/order — create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to create order", error: err });
  }
};

// GET /api/order — get all orders
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("restaurantId");
    res.json({ data: orders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
};

export const joinOpenOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { openOrderId } = req.params;
    const { userId } = req.body;

    const openOrder = await OpenOrder.findById(openOrderId);
    if (!openOrder) {
      res.status(404).json({ message: "Open order not found" });
      return;
    }

    if (!openOrder.participants.includes(userId)) {
      openOrder.participants.push(userId);
      await openOrder.save();
    }

    res.json({ message: "User joined the open order!", openOrder });
  } catch (err) {
    res.status(500).json({ message: "Failed to join open order", error: err });
  }
};
