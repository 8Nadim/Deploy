const express = require("express");
const router = express.Router();
const restaurant = require("../data/restaurantData");

router.get("/:id", (req, res) => {
  if (req.params.id === restaurant.id) {
    res.json(restaurant);
  } else {
    res.status(404).json({ message: "Restaurant not found" });
  }
});

module.exports = router;
