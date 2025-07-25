const express = require("express");
const router = express.Router();
const restaurant = require("../data/restaurantData");

// Endpoint to fetch a restaurant by its ID
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id); // Find by ObjectId
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (err) {
    res.status(400).json({ message: "Invalid ObjectId", error: err });
  }
});

// Endpoint to search for all restaurants
router.get("/search", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json({ data: restaurants });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;
