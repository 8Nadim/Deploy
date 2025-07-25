import React, { useState } from "react";
import { RestaurantData } from "@/Data/RestaurantData";

type MenuItem = { id: string; name: string; price: number };
type Restaurant = { id: string; name: string; menu: MenuItem[] };

export default function ChooseRestaurant() {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [isOpenOrder, setIsOpenOrder] = useState(false);

  // Add selected item to cart
  function addToCart(item: MenuItem) {
    setCart((prev) => [...prev, item]);
  }

  // Remove item from cart by index
  function removeFromCart(indexToRemove: number) {
    setCart((prev) => prev.filter((_, i) => i !== indexToRemove));
  }

  // Send order data to backend
  async function placeOrder() {
    if (!selectedRestaurant) return alert("Select a restaurant first");
    if (cart.length === 0) return alert("Cart is empty");

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    // Payload for normal order
    const normalOrderPayload = {
      restaurantId: selectedRestaurant.id,
      participants: [],
      totalPrice: total,
      totalCost: total,
      items: cart.map((item) => ({
        name: item.name,
        quantity: 1,
        price: item.price,
        user: "HardcodedUser",
      })),
      collectionPoint: "Outside Library",
      status: "open",
    };

    // Payload for open order
    const openOrderPayload = {
      restaurantId: selectedRestaurant.id,
      participants: [],
      totalPrice: total,
      totalCost: total,
      host: "HardcodedHost",
      deliveryLocation: "123 University Ave",
      isClosed: false,
      items: cart.map((item) => ({
        name: item.name,
        price: item.price,
      })),
    };

    // Choose endpoint and payload based on order type
    const endpoint = isOpenOrder
      ? "http://localhost:7000/api/open-orders"
      : "http://localhost:7000/api/orders";

    const payload = isOpenOrder ? openOrderPayload : normalOrderPayload;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        let msg = text;
        try {
          msg = JSON.parse(text).message || text;
        } catch {}
        throw new Error(msg || "Failed to place order");
      }

      const data = await res.json();
      localStorage.setItem("lastOrderId", data.data._id); // Save order ID locally
      alert("Order placed! ID: " + data.data._id);
      window.location.href = `/order-details/${data.data._id}`;
    } catch (err: any) {
      alert(err.message || "Failed to place order");
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Choose a Restaurant</h1>

      {!selectedRestaurant ? (
        <ul>
          {RestaurantData.map((r) => (
            <li
              key={r.id}
              onClick={() => setSelectedRestaurant(r)}
              className="cursor-pointer p-2 border mb-2 rounded hover:bg-gray-100"
            >
              {r.name}
            </li>
          ))}
        </ul>
      ) : (
        <>
          <button
            className="mb-4 text-blue-600 underline"
            onClick={() => setSelectedRestaurant(null)}
          >
            &larr; Back
          </button>

          <h2 className="text-xl font-semibold mb-2">
            {selectedRestaurant.name} Menu
          </h2>

          <ul>
            {selectedRestaurant.menu.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center mb-2"
              >
                <span>
                  {item.name} (£{item.price.toFixed(2)})
                </span>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>

          <h3 className="mt-6 font-semibold">Cart</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cart.map((item, i) => (
                <li key={i} className="flex justify-between items-center mb-1">
                  <span>
                    {item.name} (£{item.price.toFixed(2)})
                  </span>
                  <button
                    onClick={() => removeFromCart(i)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-2 font-semibold">
            Total: £{cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
          </p>

          <label className="flex items-center mt-4 space-x-2">
            <input
              type="checkbox"
              checked={isOpenOrder}
              onChange={(e) => setIsOpenOrder(e.target.checked)}
            />
            <span>Make it an Open Order (anyone can join)</span>
          </label>

          <button
            disabled={cart.length === 0}
            onClick={placeOrder}
            className={`mt-4 px-4 py-2 rounded text-white ${
              cart.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Place Order
          </button>
        </>
      )}
    </div>
  );
}
