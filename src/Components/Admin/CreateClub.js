import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const CreateClubForm = () => {
  // Get current user from Redux store
  const { user } = useSelector((state) => state.auth);
  console.log(user);

  // State for form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [coordinators, setCoordinators] = useState([]);
  const [users, setUsers] = useState([]);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/admin/users/names-ids"
        );
        setUsers(response.data.users);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle file upload
  const handleLogoUpload = (e) => {
    setLogo(e.target.files[0]);
  };

  // Handle coordinator selection
  const handleCoordinatorChange = (user) => {
    // Check if user is already selected
    const isUserAlreadySelected = coordinators.some(
      (coordinator) => coordinator === user._id
    );

    if (!isUserAlreadySelected) {
      setCoordinators([...coordinators, user._id]);
    }
    setIsUsersDropdownOpen(false);
  };

  // Remove coordinator
  const removeCoordinator = (userId) => {
    setCoordinators(coordinators.filter((id) => id !== userId));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (logo) formData.append("logo", logo);
    coordinators.forEach((coordinatorId) => {
      formData.append("coordinators", coordinatorId);
    });
    formData.append("createdBy", user._id);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/club/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Club created:", response.data);
      // Reset form or show success message
      setName("");
      setDescription("");
      setLogo(null);
      setCoordinators([]);
    } catch (error) {
      console.error(
        "Error creating club:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Create a New Club</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Club Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Club Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label
            htmlFor="logo"
            className="block text-sm font-medium text-gray-700"
          >
            Club Logo
          </label>
          <input
            type="file"
            id="logo"
            accept="image/*"
            onChange={handleLogoUpload}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* Coordinators Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">
            Select Coordinators
          </label>
          <div
            onClick={() => setIsUsersDropdownOpen(!isUsersDropdownOpen)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer"
          >
            {coordinators.length > 0
              ? `${coordinators.length} coordinator(s) selected`
              : "Select Coordinators"}
          </div>

          {isUsersDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {users.map((userData) => (
                <div
                  key={userData._id}
                  onClick={() => handleCoordinatorChange(userData)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                >
                  <span>
                    {userData.name} - {userData.role}
                  </span>
                  {coordinators.includes(userData._id) && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Coordinators */}
        {coordinators.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-700">
              Selected Coordinators:
            </h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {coordinators.map((coordId) => {
                const coordinator = users.find((u) => u._id === coordId);
                return (
                  <div
                    key={coordId}
                    className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {coordinator?.name}
                    <button
                      type="button"
                      onClick={() => removeCoordinator(coordId)}
                      className="ml-2 text-indigo-500 hover:text-indigo-700"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Club
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClubForm;
