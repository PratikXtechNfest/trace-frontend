import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { axiosInstance } from "./utils/axiosInstance";
import { addUser, removeUser } from "./store/userSlice";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import Home from "./pages/Home";
import ConfirmOtp from "./pages/ConfirmOtp";
import Dashboard from "./pages/Dashboard";
import Test from "./pages/Test";

function App() {
  const dispatch = useDispatch();

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/protected-route");
        return response.data;
      } catch (error) {
        console.log("Auth user error", error);
        if (error.response && error.response.status === 401) {
          return null;
        }
      }
    },
  });

  useEffect(() => {
    if (authUser && authUser.user) {
      dispatch(addUser(authUser.user)); // Dispatch the user to Redux
    } else {
      dispatch(removeUser()); // Remove user if not authenticated
    }
  }, [authUser, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log("authUser", authUser);

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/forget-password"
          element={!authUser ? <ForgetPassword /> : <Navigate to="/" />}
        />
        <Route
          path="/confirmotp"
          element={!authUser ? <ConfirmOtp /> : <Navigate to="/" />}
        />
        <Route
          path="/test"
          element={authUser ? <Test /> : <Navigate to="/" />}
        />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* <Route
          path="/dashboard"
          element={authUser ? <Dashboard /> : <Navigate to="/login" />}
        /> */}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
