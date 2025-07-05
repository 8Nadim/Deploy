import mongoose, { Schema, Document, Types } from "mongoose";

interface Participant {
  userId: Types.ObjectId | string;
  name?: string | null;
  items: string[];
  amountOwed?: number | null;
}

interface OrderDoc extends Document {
  restaurantId: Types.ObjectId | string;
  items: {
    name: string;
    quantity: number;
    price: number;
    user: string;
  }[];
  totalCost: number;
  participants: Participant[];
  collectionPoint: string;
  status: "open" | "closed" | "completed";
  createdAt: Date;
}

const participantSchema = new Schema<Participant>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, default: null },
  items: [{ type: String }],
  amountOwed: { type: Number, default: 0 },
});

const orderSchema = new Schema<OrderDoc>({
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
      user: String,
    },
  ],
  totalCost: { type: Number, required: true },
  participants: [participantSchema],
  collectionPoint: { type: String, required: true },
  status: {
    type: String,
    enum: ["open", "closed", "completed"],
    default: "open",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<OrderDoc>("Order", orderSchema);
