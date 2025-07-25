import { Request, Response } from "express";
import Order from "../models/Order";
import OrderModel from "../models/Order";
import OpenOrderModel from "../models/OpenOrder";

// POST /api/orders — create a normal order (demo mode)
export const createOrder = async (req: Request, res: Response) => {
  try {
    console.log("Incoming order data (demo mode):", req.body);

    // fake order response for demo/testing
    const fakeOrder = {
      _id: "demoorderid1234567890123456",
      restaurantId: "fake-restaurant-id",
      participants: [],
      totalCost: 0,
      collectionPoint: "Demo Collection Spot",
      status: "normaal",
      isClosed: false,
      createdAt: new Date().toISOString(),
      isOpenOrder: false,
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

export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    // fetch all orders, include restaurant details
    const orders = await Order.find().populate("restaurantId");
    return res.json({ data: orders });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  console.log("[Backend] getOrderById called with orderId:", orderId);

  if (orderId === "demoorderid1234567890123456") {
    // demo order data for testing
    const demoOrder = {
      _id: "demoorderid1234567890123456",
      restaurantId: "Demo Pizza Place",
      participants: [
        { name: "DemoUser", items: [], amountOwed: 9.99 },
        { name: "OtherUser", items: [], amountOwed: 9.0 },
      ],
      totalCost: 18.99,
      collectionPoint: "Demo Collection Spot",
      status: "normal",
      createdAt: new Date().toISOString(),
      isOpenOrder: false,
    };
    console.log("[Backend] Returning demo order:", demoOrder);
    return res.json(demoOrder);
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      console.log("[Backend] Order not found in DB for id:", orderId);
      return res.status(404).json({ message: "Order not found" });
    }
    const orderObj = order.toObject() as any;
    orderObj.isOpenOrder = false;
    console.log("[Backend] Found order in DB:", orderObj);
    return res.json(orderObj);
  } catch (error) {
    console.error("[Backend] Server error in getOrderById:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/orders/pay — handle payment by participant
export const payOrderHandler = async (req: Request, res: Response) => {
  try {
    const { orderId, participantName } = req.body;

    if (!orderId || !participantName) {
      return res
        .status(400)
        .json({ message: "Missing orderId or participantName" });
    }

    // handle demo payments
    if (orderId === "demoorderid1234567890123456") {
      return res.json({ message: "Payment successful (demo order)" });
    }

    if (orderId === "demoopenorderid123456789012345") {
      return res.json({ message: "Payment successful (demo open order)" });
    }

    // try find normal order first
    let order = await OrderModel.findById(orderId);

    // if not found, check open orders
    if (!order) {
      order = await OpenOrderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
    }

    // find participant by name
    const participant = order.participants.find(
      (p: any) => p.name === participantName
    );
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    // mark participant as paid
    participant.hasPaid = true;
    await order.save();

    return res.json({ message: "Payment successful" });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err instanceof Error ? err.message : err,
    });
  }
};
