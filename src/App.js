import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./Components/SignIn";
import "./App.css";

//cordinators import
import DashboardLayout from "./Components/Cordinators/Dashboard";
import CreateEvent from "./Components/Cordinators/CreateEvent";
import IssueCertificate from "./Components/Cordinators/IssueCertificate";
import MarkAttendance from "./Components/Cordinators/MarkAttendance";
import Analytics from "./Components/Cordinators/Analytics";
import RevokeCertificate from "./Components/Cordinators/RevokeCertificate";

//admin imports
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminCreateEvent from "./Components/Admin/AdminCreateEvent";
import AdminIssueCertificate from "./Components/Admin/AdminIssueCertificate";
import AdminMarkAttendance from "./Components/Admin/AdminMarkAttendance";
import AdminRevokeCertificate from "./Components/Admin/AdminRevokeCertificate";
import AdminAnalytics from "./Components/Admin/AdminAnalytics";

function App() {
  //   const [loading, setLoading] = useState(false);

  return (
    <div className="App">
      <Box justifyContent="center" alignItems="center" minHeight="100vh">
        {/* {loading ? (
        <CircularProgress />
      ) : ( */}

        <BrowserRouter>
          <Routes>
            <Route index element={<SignIn />} />

            {/* <Route
              exact
              path="/dashboard"
              element={
                // <ProtectedRoute>
                <DashBoard />
                // </ProtectedRoute>
              }
            /> */}

            {/* Cordinators Routing */}
            <Route exact path="/dashboard-layout" element={<DashboardLayout />}>
              <Route
                index
                path="analytics"
                element={
                  <>
                    <Analytics />
                  </>
                }
              />
              <Route
                index
                path="mark-attendance"
                element={
                  <>
                    <MarkAttendance />
                  </>
                }
              />
              <Route
                exact
                path="create-event"
                element={
                  <>
                    <CreateEvent />
                  </>
                }
              />
              <Route
                exact
                path="issue-certificate"
                element={
                  <>
                    <IssueCertificate />
                  </>
                }
              />
              <Route
                exact
                path="revoke-certificate"
                element={
                  <>
                    <RevokeCertificate />
                  </>
                }
              />
            </Route>

            {/* Admin Routing */}
            <Route exact path="/admin" element={<AdminDashboard />}>
              <Route
                index
                path="admin-analytics"
                element={
                  <>
                    <AdminAnalytics />
                  </>
                }
              />
              <Route
                index
                path="admin-mark-attendance"
                element={
                  <>
                    <AdminMarkAttendance />
                  </>
                }
              />
              <Route
                exact
                path="admin-create-event"
                element={
                  <>
                    <AdminCreateEvent />
                  </>
                }
              />
              <Route
                exact
                path="admin-issue-certificate"
                element={
                  <>
                    <AdminIssueCertificate />
                  </>
                }
              />
              <Route
                exact
                path="admin-revoke-certificate"
                element={
                  <>
                    <AdminRevokeCertificate />
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
