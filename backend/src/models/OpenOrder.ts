import mongoose from "mongoose";

const OpenOrderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    host: {
      type: String,
      required: true, // replace with userId if user auth is set up
    },
    participants: [
      {
        name: String,
        items: [String],
        amountOwed: Number,
      },
    ],
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

export default mongoose.model("OpenOrder", OpenOrderSchema);
