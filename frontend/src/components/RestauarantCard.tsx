import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }: any) => (
  <div className="border p-4 rounded">
    <h2 className="text-xl font-bold">{restaurant.name}</h2>
    <ul>
      {restaurant.items.map((item: any, index: number) => (
        <li key={index}>
          {item.name} - £{item.price}
        </li>
      ))}
    </ul>
    <Link to={`/order/${restaurant.id}`}>
      <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
        Order from here
      </button>
    </Link>
  </div>
);

export default RestaurantCard;
