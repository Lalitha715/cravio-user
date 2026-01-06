import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

// GraphQL mutation to insert restaurant
const ADD_RESTAURANT = gql`
  mutation AddRestaurant($object: restaurants_insert_input!) {
    insert_restaurants_one(object: $object) {
      id
      name
      status
    }
  }
`;

export default function AddRestaurant({ currentUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [addRestaurant, { loading, error }] = useMutation(ADD_RESTAURANT);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addRestaurant({
        variables: {
          object: {
            name,
            email,
            phone,
            address,
            image_url: imageUrl,
            status: "pending",
            created_by: currentUser.id,
          },
        },
      });

      alert("Restaurant request submitted! Waiting for admin approval.");
      // Optionally clear form
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setImageUrl("");
      // Navigate to dashboard/home
      navigate("/owner/my-restaurants");
    } catch (err) {
      console.error(err);
      alert("Error submitting restaurant. Try again!");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Restaurant</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Restaurant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="email"
          placeholder="Owner Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit Restaurant"}
        </button>

        {error && <p className="text-red-500 mt-2">{error.message}</p>}
      </form>
    </div>
  );
}
