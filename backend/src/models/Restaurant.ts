import mongoose, { Schema, Document } from "mongoose";

const menuItemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const restaurantSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  restaurantName: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  deliveryPrice: { type: Number, required: true },
  estimatedDeliveryTime: { type: Number, required: true },
  cuisines: [{ type: String, required: true }],
  menuItems: [menuItemSchema],
  imageUrl: { type: String, required: true },
  lastUpdated: { type: Date, required: true },
});

export interface RestaurantType extends Document {
  restaurantName: string;
  city: string;
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  cuisines: string[];
  menuItems: { name: string; price: number }[];
  imageUrl: string;
  lastUpdated: Date;
}

const Restaurant = mongoose.model<RestaurantType>(
  "Restaurant",
  restaurantSchema
);
export default Restaurant;
