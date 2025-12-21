import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const GET_PROFILE = gql`
  query GetProfile($email: String!) {
    users(where: { email: { _eq: $email } }) {
      id
      name
      email
      phone
      role
    }
  }
`;

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const { data, loading } = useQuery(GET_PROFILE, {
    variables: { email: user?.email },
    skip: !user?.email,
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  const profile = data?.users[0];

  return (
    <div className="p-6 pb-20">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <div className="bg-white rounded-xl shadow p-4">
        <p><b>Name:</b> {profile?.name}</p>
        <p><b>Email:</b> {profile?.email}</p>
        <p><b>Phone:</b> {profile?.phone}</p>
        <p><b>Role:</b> {profile?.role}</p>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
        className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
