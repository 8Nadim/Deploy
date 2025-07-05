import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Participant {
  name?: string;
  items: any[];
  amountOwed?: number;
}

interface OrderData {
  _id: string;
  restaurantId: any;
  host?: string; // Only for OpenOrder
  participants: Participant[];
  totalPrice?: number;
  totalCost?: number;
  deliveryLocation?: string; // Only for OpenOrder
  collectionPoint?: string; // Only for Order
  isClosed?: boolean;
  status?: "open" | "closed" | "completed"; // Only for Order
  createdAt: string;
  isOpenOrder?: boolean; // Add this when fetching
}

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isOpenOrder, setIsOpenOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Try OpenOrder first
        let res = await fetch(
          `http://localhost:7000/api/open-orders/${orderId}`
        );
        if (res.ok) {
          const data = await res.json();
          setIsOpenOrder(true);
          setOrder({ ...data, isOpenOrder: true });
          return;
        }

        // Try Normal Order
        res = await fetch(`http://localhost:7000/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setIsOpenOrder(false);
          setOrder({ ...data, isOpenOrder: false });
          return;
        }

        console.error("Order not found");
      } catch (err) {
        console.error("Failed to fetch order:", err);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) return <div className="p-8">Loading order details...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Order Details</h1>
      <p>
        <strong>Restaurant ID:</strong> {order.restaurantId}
      </p>

      {isOpenOrder ? (
        <>
          <p>
            <strong>Host:</strong> {order.host}
          </p>
          <p>
            <strong>Delivery Location:</strong> {order.deliveryLocation}
          </p>
          <p>
            <strong>Total Price:</strong> £{order.totalPrice?.toFixed(2)}
          </p>
          <p>
            <strong>Status:</strong> {order.isClosed ? "Closed" : "Open"}
          </p>
        </>
      ) : (
        <>
          <p>
            <strong>Collection Point:</strong> {order.collectionPoint}
          </p>
          <p>
            <strong>Total Cost:</strong> £{order.totalCost?.toFixed(2)}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </>
      )}

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Participants:</h2>
        {order.participants?.length === 0 ? (
          <p>No participants</p>
        ) : (
          <ul className="list-disc list-inside">
            {order.participants.map((p, idx) => (
              <li key={idx}>
                {p.name ?? "Anonymous"} — Items: {p.items.length} — £
                {p.amountOwed?.toFixed(2) ?? 0}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isOpenOrder && !order.isClosed && (
        <button
          onClick={() => navigate(`/join-order/${order._id}`)}
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Join Order
        </button>
      )}
    </div>
  );
};

export default OrderDetailsPage;
