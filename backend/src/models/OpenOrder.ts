import mongoose, { Document, Types, Schema } from "mongoose";

export interface Participant {
  userId: Types.ObjectId | string;
  name?: string;
  items: {
    name: string;
    price: number;
  }[];
  amountOwed?: number;
  hasPaid?: boolean;
}

// participant subdocument schema, no _id for this
const ParticipantSchema = new Schema<Participant>(
  {
    userId: { type: String },
    name: { type: String },
    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    amountOwed: { type: Number, default: 0 },
    hasPaid: { type: Boolean, default: false },
  },
  { _id: false }
);

export interface OpenOrderDoc extends Document {
  restaurantId: Types.ObjectId | string;
  host: string;
  participants: Participant[];
  totalPrice: number;
  deliveryLocation: string;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// main OpenOrder schema with timestamps
const OpenOrderSchema = new Schema<OpenOrderDoc>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    host: {
      type: String,
      required: true,
    },
    participants: [ParticipantSchema], // list of participants
    totalPrice: {
      type: Number,
      required: true,
    },
    deliveryLocation: {
      type: String,
      required: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<OpenOrderDoc>("OpenOrder", OpenOrderSchema);
