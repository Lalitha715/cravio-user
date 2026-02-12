import MapRoute from "../components/MapRoute";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUserOrders } from "../api/hasura";

export default function TrackOrder() {

    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log("Tracking Order ID:", id);

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        try {

            const userId = localStorage.getItem("userId");
            if (!userId || userId === "undefined") {
                console.log("User ID not found in localStorage");
                return;
            }
            const orders = await fetchUserOrders(userId);
            const current = orders.find(o => String(o.id) === String(id));

            if (current) {
                console.log("Current Order:", current);
                setOrder(current);
            } else {
                console.log("Order not found for ID:", id);
                setOrder(null);
            }

        } catch (err) {
            console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (loading) return <p>Loading...</p>;

        if (!order) return <p>Order not found</p>;

        // 👇 REAL RESTAURANT FROM DB
        const restaurant = order.items?.[0]?.restaurant;
        console.log("Restaurant Data:", restaurant);

        if (!restaurant?.latitude || !restaurant?.longitude) {
            return <p>No location available for this restaurant</p>;
        }

        return (
            <div className="p-4">
                <h2 className="text-xl font-bold mb-3">
                    Track Your Order
                </h2>

                <MapRoute
                    restaurant={{
                        lat: restaurant.latitude,
                        lng: restaurant.longitude
                    }}
                />
            </div>
        );
    }
