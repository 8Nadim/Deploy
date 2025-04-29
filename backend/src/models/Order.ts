import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
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
  totalCost: Number,
  participants: [String],
  collectionPoint: String,
  status: {
    type: String,
    enum: ["open", "closed", "completed"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);
