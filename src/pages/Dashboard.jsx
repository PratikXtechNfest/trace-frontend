import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../utils/axiosInstance";
import { removeUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import Users from "../components/Users";
const Dashboard = () => {
  const [tab, setTab] = useState("users");

  const user = useSelector((state) => state.user.user);
  // console.log("dash", user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const Logout = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/logout", {});
      return response;
    },
    onSuccess: (data) => {
      dispatch(removeUser());
      queryClient.invalidateQueries(["authUser"]);
      navigate("/login", { replace: true });
      console.log("Logout success", data);
    },
    onError: (error) => {
      console.log("Logout error", error);
    },
  });

  const changeTab = (tab) => {
    setTab(tab);
  };

  // console.log("tab", tab);

  return (
    <>
      <nav className="flex justify-between m-1.5 items-center mx-5 ">
        <div>Call App</div>
        <div>
          {user?.role == "user" && (
            <div className="flex items-center gap-5">
              <p>Home</p>
              <p>Config</p>
              <p>Log</p>
            </div>
          )}
          {user?.role == "reseller" && (
            <div className="flex items-center gap-5">
              <p>Home</p>
              <p>Users</p>
              <p>Config</p>
              <p>Log</p>
            </div>
          )}
          {user?.role == "super_admin" && (
            <div className="flex items-center gap-5">
              <p>Home</p>
              <p onClick={() => changeTab("users")}>Users</p>
              <p>Config</p>
              <p>Log</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p>Profile</p>
          <Button onClick={() => Logout.mutate()}> Logout </Button>{" "}
        </div>
      </nav>

      <main className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-gray-700">
              Welcome to the Dashboard {user?.name}
            </h1>
            <p className="text-gray-600">Role: {user?.role}</p>
          </header>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Section */}
            {user?.role === "user" && (
              <section className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  User Panel
                </h2>
              </section>
            )}

            {/* Reseller Section */}
            {user?.role === "reseller" && (
              <section className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Reseller Panel
                </h2>
              </section>
            )}

            {/* Admin Section */}
            {user?.role === "admin" && (
              <section className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Admin Panel
                </h2>
              </section>
            )}
          </div>
        </div>

        {tab == "users" && user?.role != "user" && <Users />}
        {/* <Users /> */}
      </main>
    </>
  );
};

export default Dashboard;
