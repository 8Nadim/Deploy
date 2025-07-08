// OpenOrderController.ts

import { Request, Response } from "express";
import mongoose from "mongoose";
import OpenOrder from "../models/OpenOrder";

// POST /api/open-orders — create an open order
export const createOpenOrder = async (req: Request, res: Response) => {
  console.log("[createOpenOrder] Received request with body:", req.body);
  try {
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
    console.log("[createOpenOrder] Responding with fake order:", fakeOpenOrder);
    return res.status(201).json({
      message: "Open order created",
      data: fakeOpenOrder,
    });
  } catch (err) {
    console.error("[createOpenOrder] Error:", err);
    return res
      .status(500)
      .json({ message: "Failed to create open order", error: err });
  }
};

// GET /api/open-orders — get all open orders
export const getAllOpenOrders = async (_req: Request, res: Response) => {
  console.log("[getAllOpenOrders] Fetching all open orders...");
  try {
    const openOrders = await OpenOrder.find().populate("restaurantId");
    console.log(
      "[getAllOpenOrders] Retrieved open orders count:",
      openOrders.length
    );
    return res.json({ data: openOrders });
  } catch (err) {
    console.error("[getAllOpenOrders] Failed to fetch open orders:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch open orders", error: err });
  }
};

// GET /api/open-orders/:orderId — get an open order by ID
export const getOpenOrderById = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  console.log("[getOpenOrderById] Request for orderId:", orderId);

  if (orderId === "demoopenorderid123456789012345") {
    const demoOrder = {
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
    };
    console.log("[getOpenOrderById] Returning demo order:", demoOrder);
    return res.json(demoOrder);
  }

  try {
    const openOrder = await OpenOrder.findById(orderId);
    if (!openOrder) {
      console.warn("[getOpenOrderById] Open order not found:", orderId);
      return res.status(404).json({ message: "Open order not found" });
    }
    console.log("[getOpenOrderById] Found open order:", openOrder);
    return res.json(openOrder);
  } catch (error) {
    console.error("[getOpenOrderById] Server error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/open-orders/join — join an open order
export const joinOpenOrder = async (req: Request, res: Response) => {
  console.log("[joinOpenOrder] Payload received:", req.body);
  try {
    const { orderId, userId, name, items } = req.body;

    if (!orderId || !userId || !name) {
      console.warn("[joinOpenOrder] Missing orderId, userId, or name");
      return res
        .status(400)
        .json({ message: "Missing orderId, userId, or name" });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      console.warn("[joinOpenOrder] Invalid orderId format:", orderId);
      return res.status(400).json({ message: "Invalid orderId format" });
    }

    const openOrder = await OpenOrder.findById(orderId);
    if (!openOrder) {
      console.warn("[joinOpenOrder] Open order not found:", orderId);
      return res.status(404).json({ message: "Open order not found" });
    }

    const amountOwed = Array.isArray(items)
      ? items.reduce((sum, item) => sum + (item.price || 0), 0)
      : 0;

    console.log("[joinOpenOrder] Calculated amountOwed:", amountOwed);

    const existingParticipant = openOrder.participants.find(
      (p) => p.userId.toString() === userId
    );

    if (existingParticipant) {
      console.log("[joinOpenOrder] Updating existing participant");
      existingParticipant.name = name;
      existingParticipant.items = items;
      existingParticipant.amountOwed = amountOwed;
    } else {
      console.log("[joinOpenOrder] Adding new participant");
      openOrder.participants.push({ userId, name, items, amountOwed });
    }

    await openOrder.save();

    console.log("[joinOpenOrder] Saved open order:", openOrder);
    return res
      .status(200)
      .json({ message: "Joined open order", data: openOrder });
  } catch (err) {
    console.error("[joinOpenOrder] JOIN ERROR:", err);
    return res.status(500).json({
      message: "Failed to join open order",
      error: (err as Error).message,
    });
  }
};
