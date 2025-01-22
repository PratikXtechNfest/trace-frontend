import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { KeyRound, Pencil } from "lucide-react";
import { axiosInstance } from "../utils/axiosInstance";

const Users = () => {
  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users");
      return response.data;
    },
    onSuccess: (data) => {
      console.log("users", data);
    },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = filteredUsers
    ? Math.ceil(filteredUsers.length / entriesPerPage)
    : 1;

  const currentUsers = filteredUsers?.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleUpdateUser = async (updatedUser) => {
    try {
      await axiosInstance.put(`/users/${updatedUser.id}`, updatedUser);
      refetch(); // Re-fetch updated data
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when search changes
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <p className="text-2xl font-bold text-blue-700 mb-4">Users</p>

      {/* Records Per Page and Search */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border border-blue-300 bg-white text-blue-700 p-2 rounded shadow-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
          <span className="text-gray-600">Entries per Page</span>
        </div>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={handleSearch}
          className="border border-blue-300 bg-white p-2 rounded w-[30%] shadow-sm"
        />
      </div>

      {/* User Table */}
      <table className="table-auto border-collapse border border-gray-300 w-full bg-white rounded shadow-lg">
        <thead className="bg-blue-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-blue-700">
              User ID
            </th>
            <th className="border border-gray-300 px-4 py-2 text-blue-700">
              Name
            </th>
            <th className="border border-gray-300 px-4 py-2 text-blue-700">
              Email
            </th>
            <th className="border border-gray-300 px-4 py-2 text-blue-700">
              Role
            </th>
            <th className="border border-gray-300 px-4 py-2 text-blue-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {currentUsers?.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onUpdateUser={handleUpdateUser}
            />
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="font-semibold text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const UserRow = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedRole, setEditedRole] = useState(user.role);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedUser = { ...user, name: editedName, role: editedRole };
      await onUpdateUser(updatedUser);
      setIsEditing(false); // Exit edit mode after save
    } catch (error) {
      console.error("Error updating user", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    console.log("password");
  };

  return (
    <tr>
      <td className="border border-gray-300 px-4 py-2 text-center">
        {user.id}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-center">
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="border border-gray-300 p-1 rounded w-full"
          />
        ) : (
          user.name
        )}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-center">
        {user.email}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-center">
        {isEditing ? (
          <input
            type="text"
            value={editedRole}
            onChange={(e) => setEditedRole(e.target.value)}
            className="border border-gray-300 p-1 rounded w-full"
          />
        ) : (
          user.role
        )}
      </td>
      <td className="border border-gray-300 px-4 py-2 text-center flex justify-evenly space-x-2">
        {isEditing ? (
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        ) : (
          <Pencil
            className="cursor-pointer"
            onClick={() => setIsEditing(true)}
          />
        )}
        <button
          onClick={handleUpdatePassword}
          disabled={isLoading}
          className=""
        >
          {isLoading ? "Updating..." : <KeyRound />}
        </button>
      </td>
    </tr>
  );
};

export default Users;
