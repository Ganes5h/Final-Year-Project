import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./Components/SignIn";
import DashboardLayout from "./Components/Dashboard";
import "./App.css";
import CreateEvent from "./Components/CreateEvent";
import IssueCertificate from "./Components/IssueCertificate";
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

            <Route exact path="/dashboard-layout" element={<DashboardLayout />}>
              {/* {/* <Route exact path="analytics" element={<Analytics />}></Route> */}

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
