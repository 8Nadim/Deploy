import mongoose, { Document, Types, Schema } from "mongoose";

export interface Participant {
  userId: Types.ObjectId | string;
  name?: string;
  items: string[];
  amountOwed?: number;
}

export interface OpenOrderDoc extends Document {
  restaurantId: Types.ObjectId | string;
  host: string;
  participants: Types.DocumentArray<Participant>;
  totalPrice: number;
  deliveryLocation: string;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema<Participant>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String },
  items: [{ type: String }],
  amountOwed: { type: Number, default: 0 },
});

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
    participants: [ParticipantSchema],
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
