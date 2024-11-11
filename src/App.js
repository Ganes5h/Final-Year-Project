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
