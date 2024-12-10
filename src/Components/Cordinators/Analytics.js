import React from "react";
import { useSelector } from "react-redux";
 
function Analytics() {
  // Get token, isAuthenticated, and user from Redux state
  const { token, isAuthenticated, user } = useSelector((state) => state.auth); 
  console.log(user, token, isAuthenticated);

  return (
    <div>
      <h1>Analytics</h1>
      <p>
        Here you will be able to see all event counts, certificates issued, etc.
      </p>

      {isAuthenticated ? (
        <div>
          <h2>Welcome, {user?.name || "User"}</h2>
          <h2>Welcome, {user?._id || "User"}</h2>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
          {/* <p>Token: {token}</p> */}
        </div>
      ) : (
        <p>Please log in to view analytics.</p>
      )}
    </div>
  );
}

export default Analytics;
