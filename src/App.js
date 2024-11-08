import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./Components/SignIn";
import DashBoard from "./Components/Dashboard";
import "./App.css";

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
            <Route
              exact
              path="/dashboard"
              element={
                // <ProtectedRoute>
                <DashBoard />
                // </ProtectedRoute>
              }
            />
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
