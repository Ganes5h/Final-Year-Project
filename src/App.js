import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./Components/SignIn";
import "./App.css";
import ProtectedRoute from "./Components/ProtectedRoute";

//cordinators import
import DashboardLayout from "./Components/Cordinators/Dashboard";
import CreateEvent from "./Components/Cordinators/CreateEvent";
import IssueCertificate from "./Components/Cordinators/IssueCertificate";
import MarkAttendance from "./Components/Cordinators/MarkAttendance";
import Analytics from "./Components/Cordinators/Analytics";
import RevokeCertificate from "./Components/Cordinators/RevokeCertificate";
import VerifyCertificate from "./Components/Cordinators/VerifyCertificate";

import ViewEvent from "./Components/Cordinators/ViewEvent";

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
              {/* <Route
                exact
                path="events"
                element={
                  <>
                    <CreateEvent />
                  </>
                }
              /> */}
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
                path="verify-certificate"
                element={
                  <>
                    <VerifyCertificate />
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
              <Route
                exact
                path="events/create-event"
                element={
                  <>
                    <CreateEvent />
                  </>
                }
              />
              <Route
                exact
                path="events/view-events"
                element={
                  <>
                    <ViewEvent />
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
