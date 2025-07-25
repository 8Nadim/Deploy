import React, { useState } from "react";

type Restaurant = {
  name: string;
  location: string;
  menuItems: string[];
  deliveryPrice: number;
  estimatedDeliveryTime: number;
};

type Props = {
  addRestaurant: (restaurant: Restaurant) => void;
};

const RestaurantForm: React.FC<Props> = ({ addRestaurant }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [menuItems, setMenuItems] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState(5.99);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create the restaurant object to send to the backend
    const newRestaurant = {
      restaurantName: name,
      city: location, // Adjust as needed for your model
      country: "USA", // Example, adjust accordingly
      deliveryPrice,
      estimatedDeliveryTime,
      cuisines: menuItems.split(","),
      imageUrl: "http://example.com/image.jpg", // Example, adjust accordingly
    };

    // Send the data to the backend
    try {
      await fetch("/api/restaurant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRestaurant),
      });

      // Update local state to reflect the new restaurant
      addRestaurant({
        name,
        location,
        menuItems: menuItems.split(","),
        deliveryPrice,
        estimatedDeliveryTime,
      });

      // Clear the form after submission
      setName("");
      setLocation("");
      setMenuItems("");
      setDeliveryPrice(5.99);
      setEstimatedDeliveryTime(30);
    } catch (err) {
      console.error("Error adding restaurant", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Restaurant Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Menu Items (comma separated)"
        value={menuItems}
        onChange={(e) => setMenuItems(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Delivery Price"
        value={deliveryPrice}
        onChange={(e) => setDeliveryPrice(parseFloat(e.target.value))}
        required
      />
      <input
        type="number"
        placeholder="Estimated Delivery Time (in minutes)"
        value={estimatedDeliveryTime}
        onChange={(e) => setEstimatedDeliveryTime(parseInt(e.target.value))}
        required
      />
      <button type="submit">Add Restaurant</button>
    </form>
  );
};

export default RestaurantForm;
