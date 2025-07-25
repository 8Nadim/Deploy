import React, { useEffect, useState } from "react";
import axios from "axios";
import RestaurantForm from "../components/RestaurantForm";

type Restaurant = {
  _id?: string;
  restaurantName: string;
  city: string;
  country: string;
  cuisines: string[];
  imageUrl: string;
};

const RestaurantPage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  // Fetch existing restaurants from backend
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Tell TypeScript what the response data shape is
        const res = await axios.get<{ data: Restaurant[] }>(
          "http://localhost:7000/api/restaurant/search"
        );
        console.log("Fetched restaurants:", res.data.data);
        setRestaurants(res.data.data);
      } catch (err) {
        console.error("Error fetching restaurants", err);
      }
    };

    fetchRestaurants();
  }, []);

  // Add new restaurant (POST to backend)
  const addRestaurant = async (restaurant: {
    name: string;
    location: string;
    menuItems: string[];
  }) => {
    try {
      const payload = {
        restaurantName: restaurant.name,
        city: restaurant.location,
        country: "UK",
        cuisines: restaurant.menuItems,
        deliveryPrice: 5.99,
        estimatedDeliveryTime: 30,
        imageUrl: "http://example.com/image.jpg",
      };

      // Tell TypeScript what the response data shape is
      const res = await axios.post<{ data: Restaurant }>(
        "http://localhost:7000/api/restaurant",
        payload
      );

      // Append new restaurant properly typed
      setRestaurants((prev) => [...prev, res.data.data]);
    } catch (err) {
      console.error("Error adding restaurant", err);
    }
  };

  return (
    <div>
      <h1>UrOrder: Restaurant Manager</h1>
      <RestaurantForm addRestaurant={addRestaurant} />
      <h2>Restaurants</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {restaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              width: "250px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={restaurant.imageUrl}
              alt={restaurant.restaurantName}
              style={{ width: "100%", borderRadius: "4px" }}
            />
            <h3>{restaurant.restaurantName}</h3>
            <p>
              {restaurant.city}, {restaurant.country}
            </p>
            <p>
              <strong>Cuisines:</strong> {restaurant.cuisines.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantPage;
