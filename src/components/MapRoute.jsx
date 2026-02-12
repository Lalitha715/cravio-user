import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapRoute = ({ restaurant }) => {

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [userLocation, setUserLocation] = useState(null);

  // 🟢 1. User Location Get
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setUserLocation({
        lng: pos.coords.longitude,
        lat: pos.coords.latitude,
      });
    });
  }, []);

  // 🟢 2. Map Load + Route Draw
  useEffect(() => {
    if (!userLocation || !restaurant?.lat || !restaurant?.lng) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [userLocation.lng, userLocation.lat],
      zoom: 12,
    });

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      profile: "mapbox/driving",
    });

    map.current.addControl(directions, "top-left");

    directions.setOrigin([userLocation.lng, userLocation.lat]);

    directions.setDestination([
      restaurant.lng,
      restaurant.lat,
    ]);

    return () => {
      map.current?.remove();   // 👈 cleanup (very important)
    };

  }, [userLocation, restaurant]);   // 👈 dependency fixed

  return (
    <div className="w-full h-[500px] rounded-xl shadow">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MapRoute;
