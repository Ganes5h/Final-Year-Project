import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./Components/SignIn";
import "./App.css";
import ProtectedRoute from "./Components/ProtectedRoute";
import {
  requestNotificationPermission,
  handleIncomingMessages,
  refreshToken,
} from "./firebaseSetup";
import { useEffect } from "react";
//cordinators import
import DashboardLayout from "./Components/Admin/Dashboard";

import Profile from "./Components/Admin/Profile";
import CreateClub from "./Components/Admin/CreateClub";
import ViewClubs from "./Components/Admin/ViewClubs";
import DeleteClub from "./Components/Admin/DeleteClub";

function App() {
  //   const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Request notification permission
    requestNotificationPermission();

    // Handle incoming notifications
    handleIncomingMessages();

    // Regularly refresh tokens
    const interval = setInterval(refreshToken, 60 * 60 * 1000); // Refresh every hour

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="App">
      <Box justifyContent="center" alignItems="center" minHeight="100vh">
        {/* {loading ? (
        <CircularProgress />
      ) : ( */}

        <BrowserRouter>
          <Routes>
            <Route index element={<SignIn />} />

            {/* Cordinators Routing */}
            <Route
              exact
              path="/dashboard-layout"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                path="create-club"
                element={
                  <>
                    <CreateClub />
                  </>
                }
              />
              <Route
                index
                path="view-clubs"
                element={
                  <>
                    <ViewClubs />
                  </>
                }
              />
              <Route
                exact
                path="edit-profile"
                element={
                  <>
                    <Profile />
                  </>
                }
              />

              <Route
                exact
                path="delete-club"
                element={
                  <>
                    <DeleteClub />
                  </>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>

        {/* )} */}

        {/* Footer only shown outside the dashboard */}
        {/* {!loading &&
        !window.location.exact pathname.startsWith("/dashboard-layout") && <Footer />} */}
      </Box>
    </div>
  );
}

export default App;
