import { Request, Response } from "express";
import mongoose from "mongoose";
import OpenOrder from "../models/OpenOrder";

// POST /api/open-orders — create an open order
export const createOpenOrder = async (req: Request, res: Response) => {
  console.log("[createOpenOrder] Received request with body:", req.body);
  try {
    // demo fake open order returned instead of real DB save
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
      isOpenOrder: true,
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
    // get all open orders, join restaurant data
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
  const userId = req.query["userId"] as string; // expect from frontend

  console.log(
    "[getOpenOrderById] Request for orderId:",
    orderId,
    "userId:",
    userId
  );

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  if (orderId === "demoopenorderid123456789012345") {
    // special case: demo order allows all users for now
    const demoOrder = {
      _id: "demoopenorderid123456789012345",
      restaurantId: "Demo Sushi Place",
      items: [{ name: "Demo Sushi", price: 12.99 }],
      totalPrice: 12.99,
      deliveryLocation: "Demo Location",
      host: "Demo Host",
      isClosed: false,
      participants: [
        {
          userId: "679d756c2de0b9feee5ff651",
          name: "Demo Host",
          items: [],
          amountOwed: 0,
        },
      ],
      createdAt: new Date().toISOString(),
      isOpenOrder: true,
    };

    // check if user is host or participant
    const isAllowed =
      demoOrder.host === userId ||
      demoOrder.participants.some((p) => p.userId === userId);

    if (!isAllowed) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.json({ data: demoOrder });
  }

  try {
    const openOrder = await OpenOrder.findById(orderId);
    if (!openOrder) {
      return res.status(404).json({ message: "Open order not found" });
    }

    // only allow host or participants to view order
    const isParticipantOrHost =
      openOrder.host?.toString() === userId ||
      openOrder.participants.some((p) => p.userId.toString() === userId);

    if (!isParticipantOrHost) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.json(openOrder);
  } catch (error) {
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

    // skip ObjectId check for demo order
    if (
      orderId !== "demoopenorderid123456789012345" &&
      !mongoose.Types.ObjectId.isValid(orderId)
    ) {
      console.warn("[joinOpenOrder] Invalid orderId format:", orderId);
      return res.status(400).json({ message: "Invalid orderId format" });
    }

    if (orderId === "demoopenorderid123456789012345") {
      // fake add participant for demo order
      console.log("[joinOpenOrder] Joined demo open order:", {
        userId,
        name,
        items,
      });
      return res.status(200).json({
        message: "Joined demo open order (hardcoded)",
        data: {
          _id: orderId,
          restaurantId: "Demo Sushi Place",
          items: [{ name: "Demo Sushi", price: 12.99 }],
          totalPrice: 12.99,
          deliveryLocation: "Demo Location",
          host: "Demo Host",
          isClosed: false,
          participants: [
            {
              userId,
              name,
              items,
              amountOwed: (items as any[]).reduce(
                (sum, item) => sum + (item.price || 0),
                0
              ),
            },
          ],
          createdAt: new Date().toISOString(),
          isOpenOrder: true,
        },
      });
    }

    // real DB join logic
    const openOrder = await OpenOrder.findById(orderId);
    if (!openOrder) {
      console.warn("[joinOpenOrder] Open order not found:", orderId);
      return res.status(404).json({ message: "Open order not found" });
    }

    const existingParticipant = openOrder.participants.find(
      (p) => p.userId.toString() === userId
    );

    if (existingParticipant) {
      return res.status(409).json({
        message: "User already joined this order",
      });
    }

    // calculate total cost of items
    const amountOwed = Array.isArray(items)
      ? items.reduce((sum, item) => sum + (item.price || 0), 0)
      : 0;

    // add new participant
    openOrder.participants.push({ userId, name, items, amountOwed });

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

// DELETE /api/open-orders/:orderId/leave — leave an open order
export const leaveOpenOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { userId } = req.body;

  if (!orderId || !userId) {
    return res.status(400).json({ message: "Missing orderId or userId" });
  }

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: "Invalid orderId format" });
  }

  try {
    const openOrder = await OpenOrder.findById(orderId);
    if (!openOrder) {
      return res.status(404).json({ message: "Open order not found" });
    }

    // find participant index by userId
    const index = openOrder.participants.findIndex(
      (p) => p.userId.toString() === userId
    );

    if (index === -1) {
      return res.status(404).json({ message: "User not part of this order" });
    }

    // remove participant from array
    openOrder.participants.splice(index, 1);

    await openOrder.save();

    return res
      .status(200)
      .json({ message: "Left open order", data: openOrder });
  } catch (err) {
    return res.status(500).json({ message: "Failed to leave open order" });
  }
};
