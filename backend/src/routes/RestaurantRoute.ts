import express from "express";
import { param, body } from "express-validator";
import {
  addRestaurant,
  getRestaurant,
  searchRestaurant,
} from "../controllers/RestaurantController";
import { handleValidationErrors } from "../middleware/validation";

const router = express.Router();

// Add new restaurant
router.post(
  "/",
  body("restaurantName")
    .isString()
    .notEmpty()
    .withMessage("Restaurant name is required"),
  body("city").isString().notEmpty().withMessage("City is required"),
  body("country").isString().notEmpty().withMessage("Country is required"),
  body("deliveryPrice")
    .isFloat({ gt: 0 })
    .withMessage("Delivery price must be greater than 0"),
  body("estimatedDeliveryTime")
    .isInt({ gt: 0 })
    .withMessage("Estimated delivery time must be greater than 0"),
  body("cuisines").isArray().withMessage("Cuisines should be an array"),
  body("imageUrl").isString().notEmpty().withMessage("Image URL is required"),
  handleValidationErrors,
  addRestaurant
);

// Search restaurants
router.get("/search", searchRestaurant);

// Get single restaurant by ID
router.get(
  "/:restaurantId",
  param("restaurantId")
    .isMongoId()
    .withMessage("RestaurantId must be a valid ObjectId"),
  handleValidationErrors,
  getRestaurant
);

export default router;
