import { Pencil } from "lucide-react";
import React, { useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";

import { Button } from "@/components/ui/button";

const UserRow = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedRole, setEditedRole] = useState(user.role);
  const [isLoading, setIsLoading] = useState(false);

  const UserRowStyle =
    "border-2 border-orange-300 w-[20%] flex justify-center ";

  const { email, id } = user;

  // Handle save changes by calling API
  const handleSave = async () => {
    setIsLoading(true);

    try {
      const updatedUser = {
        ...user,
        name: editedName,
        role: editedRole,
      };

      // Call API to update user (adjust URL and payload as per your API)
      const response = await axiosInstance.put(
        `/users/${user.id}`,
        updatedUser
      );

      console.log("User updated successfully", response.data);
      setIsEditing(false); // Stop editing after saving
      onUpdateUser(response.data); // Pass the updated user to the parent component
    } catch (error) {
      console.error("Error updating user", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-between border-2 border-blue-400 mx-3 my-1.5">
      <p className="border-2 border-orange-300 w-[20%]"> {id} </p>

      {/* Editable Name */}
      {isEditing ? (
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="border border-gray-300 p-1 rounded"
        />
      ) : (
        <p className={UserRowStyle}>{user.name} </p>
      )}

      <p className={UserRowStyle}>{email} </p>

      {/* Editable Role */}
      {isEditing ? (
        <input
          type="text"
          value={editedRole}
          onChange={(e) => setEditedRole(e.target.value)}
          className="border border-gray-300 p-1 rounded"
        />
      ) : (
        <p className={UserRowStyle}>{user.role} </p>
      )}

      {/* Edit Button */}
      {!isEditing && (
        <p className={UserRowStyle}>
          <Pencil
            className="cursor-pointer"
            onClick={() => setIsEditing((prev) => !prev)} // Toggle edit mode
          />
        </p>
      )}

      {/* Save Button */}
      {isEditing && (
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded ml-2"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      )}

      <Button>Update Password</Button>
    </section>
  );
};

export default UserRow;
