import { Request, Response } from "express";
import Order from "../models/Order";

// POST /api/orders — create a normal order

export const createOrder = async (req: Request, res: Response) => {
  try {
    // You can log incoming data for debug
    console.log("Incoming order data (demo mode):", req.body);

    // Fake order object to send back
    const fakeOrder = {
      _id: "demoorderid1234567890123456",
      restaurantId: "demo_restaurant_id_1234567890",
      items: [
        { name: "Demo Pizza", quantity: 1, price: 9.99, user: "DemoUser" },
      ],
      totalCost: 9.99,
      participants: [],
      collectionPoint: "Outside Library",
      status: "open",
      createdAt: new Date(),
    };

    return res.status(201).json({
      message: "Order created",
      data: fakeOrder,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to create order", error: err });
  }
};

// GET /api/orders — get all normal orders
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("restaurantId");
    return res.json({ data: orders });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err });
  }
};
