import { NavLink } from "react-router-dom";
import { HomeIcon, ShoppingBagIcon, ClipboardDocumentListIcon, UserIcon } from "@heroicons/react/24/outline";
import { gql, useQuery } from "@apollo/client";

const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
    }
  }
`;

function BottomNav() {
  const { data, loading } = useQuery(GET_RESTAURANTS);

  const firstRestaurantId = loading ? "" : data?.restaurants?.[0]?.id;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-t flex justify-around py-2">
      <NavLink
        to="/home"
        className="flex flex-col items-center text-gray-500 hover:text-orange-500"
      >
        <HomeIcon className="w-6 h-6" />
        <span className="text-xs">Home</span>
      </NavLink>

      <NavLink
        to={firstRestaurantId ? `/restaurant/${firstRestaurantId}` : "#"}
        className="flex flex-col items-center text-gray-500 hover:text-orange-500"
      >
        <ShoppingBagIcon className="w-6 h-6" />
        <span className="text-xs">Restaurants</span>
      </NavLink>

      <NavLink 
        to="/orders"
        className="flex flex-col items-center text-gray-500 hover:text-orange-500"
      >
        <ClipboardDocumentListIcon className="w-6 h-6" />
        <span className="text-xs">Orders</span>
      </NavLink>

      <NavLink
        to="/cart"
        className="flex flex-col items-center text-gray-500 hover:text-orange-500"
      >
        <ClipboardDocumentListIcon className="w-6 h-6" />
        <span className="text-xs">Cart</span>
      </NavLink>

      <NavLink
        to="/profile"
        className="flex flex-col items-center text-gray-500 hover:text-orange-500"
      >
        <UserIcon className="w-6 h-6" />
        <span className="text-xs">Profile</span>
      </NavLink>
    </div>
  );
}

export default BottomNav;
