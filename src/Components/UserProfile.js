import React, { useState } from "react";
import fromicon from "../assets/formicon.png";
import API from "../Components/services/api";

const UserProfile = ({ userData, setUserData, PublicView = true }) => {
  const [isEditing, setIsEditing] = useState(false); // Toggle for edit mode
  const [tempFirstName, setTempFirstName] = useState(userData?.firstName || "");
  const [tempLastName, setTempLastName] = useState(userData?.lastName || "");

  const handleEditClick = () => {
    setIsEditing(true); // Enable editing
    setTempFirstName(userData?.firstName || ""); // Initialize temp values
    setTempLastName(userData?.lastName || "");
  };

  const handleUpdate = async () => {
    try {
      // Prepare the data for the backend update
      const updatedData = {
        firstName: tempFirstName,
        lastName: tempLastName,
      };

      // Make an API call to update the user data
      const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
      const response = await API.put(`/users/${userId}`, updatedData);

      if (response.status === 200) {
        // Update the local state with the new values
        setUserData((prev) => ({
          ...prev,
          firstName: tempFirstName,
          lastName: tempLastName,
        }));

        setIsEditing(false); // Exit edit mode
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="w-full px-5 flex justify-between items-center">
      <div></div>
      <h1 className="text-xl sm:text-4xl text-center font-bold uppercase">
        {!isEditing ? (
          `${userData?.firstName} ${userData?.lastName}`
        ) : (
          <div className="flex flex-col items-center gap-2">
            <input
              type="text"
              value={tempFirstName} // Bind to tempFirstName
              onChange={(e) => setTempFirstName(e.target.value)} // Update tempFirstName
              placeholder="First Name"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <input
              type="text"
              value={tempLastName} // Bind to tempLastName
              onChange={(e) => setTempLastName(e.target.value)} // Update tempLastName
              placeholder="Last Name"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
        )}
      </h1>
      <div>
        {!isEditing ? (
          PublicView ? (
            <img
              alt=""
              src={fromicon}
              className="w-7 lg:w-10 cursor-pointer"
              onClick={handleEditClick}
            />
          ) : null
        ) : (
          <button
            onClick={handleUpdate}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;