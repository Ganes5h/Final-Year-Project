import React from "react";
import { useSelector } from "react-redux";
import { Users, Calendar, Award } from "lucide-react";
function Analytics() {
  // Get token, isAuthenticated, and user from Redux state
  const { token, isAuthenticated, user } = useSelector((state) => state.auth);
  console.log(user, token, isAuthenticated);

  return (
    // <div>
    //   <h1>Analytics</h1>
    //   <p>
    //     Here you will be able to see all event counts, certificates issued, etc.
    //   </p>

    //   {isAuthenticated ? (
    //     <div>
    //       <h2>Welcome, {user?.name || "User"}</h2>
    //       <h2>Welcome, {user?._id || "User"}</h2>
    //       <p>Email: {user?.email}</p>
    //       <p>Role: {user?.role}</p>
    //       {/* <p>Token: {token}</p> */}
    //     </div>
    //   ) : (
    //     <p>Please log in to view analytics.</p>
    //   )}
    // </div>

    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Club Name Card */}
        <div className="bg-white shadow-xl rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <Users className="text-blue-600 w-12 h-12 mb-4" />
              <h2 className="text-xl font-bold text-gray-800">Club Name</h2>
              <p className="text-2xl font-extrabold text-blue-600">Rotaract</p>
            </div>
          </div>
        </div>

        {/* Events Card */}
        <div className="bg-white shadow-xl rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <Calendar className="text-green-600 w-12 h-12 mb-4" />
              <h2 className="text-xl font-bold text-gray-800">Total Events</h2>
              <p className="text-3xl font-extrabold text-green-600">3</p>
            </div>
          </div>
        </div>

        {/* Certificates Card */}
        <div className="bg-white shadow-xl rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <Award className="text-purple-600 w-12 h-12 mb-4" />
              <h2 className="text-xl font-bold text-gray-800">
                Certificates Issued
              </h2>
              <p className="text-3xl font-extrabold text-purple-600">200</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
