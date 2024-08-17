import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  console.log(user?.picture)
  console.log(user)
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && user && (
      <div>
        <img src={user.picture} className="w-8 h-8" alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

export default Profile;