import { Request, Response } from "express";
import Restaurant from "../models/Restaurant";
import mongoose from "mongoose";

const addRestaurant = async (req: Request, res: Response) => {
  const {
    restaurantName,
    city,
    country,
    deliveryPrice,
    estimatedDeliveryTime,
    cuisines,
    imageUrl,
  } = req.body;

  const cuisinesArray = Array.isArray(cuisines)
    ? cuisines
    : cuisines.split(",");

  try {
    const newRestaurant = new Restaurant({
      restaurantName,
      city,
      country,
      deliveryPrice,
      estimatedDeliveryTime,
      cuisines: cuisinesArray,
      imageUrl,
      lastUpdated: Date.now(),
    });

    await newRestaurant.save();

    res.status(201).json(newRestaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding restaurant" });
  }
};

const getRestaurant = async (req: Request, res: Response) => {
  const restaurantId = req.params["restaurantId"] as string;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    return res.status(400).json({ message: "Invalid restaurantId format" });
  }

  try {
    const restaurant = await Restaurant.findById(restaurantId);

    // Check if the restaurant exists
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Return restaurant data
    return res.json(restaurant);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const searchQuery = (req.query["searchQuery"] as string) || "";
    const selectedCuisines = (req.query["selectedCuisines"] as string) || "";
    const sortOption = (req.query["sortOption"] as string) || "lastUpdated";
    const page = parseInt(req.query["page"] as string) || 1;
    let query: any = {};

    // Handle cuisine filters
    if (selectedCuisines.trim()) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine.trim(), "i"));
      query["cuisines"] = { $in: cuisinesArray };
    }

    // Handle text search
    if (searchQuery.trim()) {
      const searchRegex = new RegExp(searchQuery.trim(), "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const restaurants = await Restaurant.find(query)
      .select("restaurantName city country cuisines imageUrl lastUpdated")
      .sort({ [sortOption]: -1 }) // Sort descending
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(query);

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Export functions directly
export { addRestaurant, getRestaurant, searchRestaurant };
