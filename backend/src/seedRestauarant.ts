import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurant from "./models/Restaurant";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env["MONGODB_URI"]!);
    console.log("MongoDB connected");

    await Restaurant.deleteMany({});

    const newRestaurant = await Restaurant.create({
      restaurantName: "Test Pizza Place",
      city: "Leicester",
      country: "UK",
      deliveryPrice: 3.99,
      estimatedDeliveryTime: 30,
      cuisines: ["Pizza", "Italian"],
      imageUrl: "https://via.placeholder.com/300x200.png?text=Pizza+Place",
      lastUpdated: new Date(),
      menuItems: [
        { name: "Margherita Pizza", price: 8.5 },
        { name: "Pepperoni Pizza", price: 9.5 },
      ],
    });

    console.log("Seeded restaurant:", newRestaurant);
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
