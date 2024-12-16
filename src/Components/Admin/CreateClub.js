import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Users, X, FileText, ImageIcon } from "lucide-react";
import BaseUrl from "../../BaseUrl/BaseUrl";

const CreateClubForm = () => {
  const { user } = useSelector((state) => state.auth);

  const [clubDetails, setClubDetails] = useState({
    name: "",
    description: "",
    logo: null,
    coordinators: [],
    createdBy: user?._id,
  });

  const [users, setUsers] = useState([]);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/admin/users/names-ids`);
        setUsers(response.data.users);
      } catch (error) {
        console.error("Failed to fetch users", error);
        toast.error("Failed to load users");
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClubDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    setClubDetails((prev) => ({ ...prev, logo: file }));
  };

  const handleCoordinatorChange = (user) => {
    const isUserAlreadySelected = clubDetails.coordinators.some(
      (coordinatorId) => coordinatorId === user._id
    );

    if (!isUserAlreadySelected) {
      setClubDetails((prev) => ({
        ...prev,
        coordinators: [...prev.coordinators, user._id],
      }));
    }
    setIsUsersDropdownOpen(false);
  };

  const removeCoordinator = (userId) => {
    setClubDetails((prev) => ({
      ...prev,
      coordinators: prev.coordinators.filter((id) => id !== userId),
    }));
  };

  const togglePreviewModal = () => {
    setShowPreviewModal(!showPreviewModal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", clubDetails.name);
    formData.append("description", clubDetails.description);
    if (clubDetails.logo) formData.append("logo", clubDetails.logo);
    clubDetails.coordinators.forEach((coordinatorId) => {
      formData.append("coordinators", coordinatorId);
    });
    formData.append("createdBy", clubDetails.createdBy);

    try {
      const response = await axios.post(`${BaseUrl}/club/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Club Created Successfully");

      // Reset form
      setClubDetails({
        name: "",
        description: "",
        logo: null,
        coordinators: [],
        createdBy: user?._id,
      });
    } catch (error) {
      console.error(
        "Error creating club:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl mt-10">
      <div className="bg-blue-500 text-white py-6 px-8 rounded-t-lg">
        <h1 className="text-3xl font-bold">
          Create Club
          {/* <Users fontSize="large" /> */}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-8">
        {/* Club Name */}
        <div>
          <label className="block text-sm text-start font-medium">
            Club Name*
          </label>
          <input
            type="text"
            name="name"
            value={clubDetails.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-start font-medium">
            Description*
          </label>
          <textarea
            name="description"
            value={clubDetails.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm text-start font-medium">
            Club Logo*
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="w-full p-3 border rounded-md shadow-sm file:mr-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Coordinators Dropdown */}
        <div>
          <label className="block text-sm text-start font-medium">
            Select Coordinators*
          </label>
          <div
            onClick={() => setIsUsersDropdownOpen(!isUsersDropdownOpen)}
            className="w-full p-3 border rounded-md shadow-sm cursor-pointer"
          >
            {clubDetails.coordinators.length > 0
              ? `${clubDetails.coordinators.length} coordinator(s) selected`
              : "Select Coordinators"}
          </div>

          {isUsersDropdownOpen && (
            <div className="relative">
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
                    {clubDetails.coordinators.includes(userData._id) && (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Selected Coordinators */}
        {clubDetails.coordinators.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-700">
              Selected Coordinators:
            </h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {clubDetails.coordinators.map((coordId) => {
                const coordinator = users.find((u) => u._id === coordId);
                return (
                  <div
                    key={coordId}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {coordinator?.name}
                    <button
                      type="button"
                      onClick={() => removeCoordinator(coordId)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600"
          >
            Create Club
          </button>
          <button
            type="button"
            onClick={togglePreviewModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600"
          >
            Preview
            {/* <FileText className="ms-2" /> */}
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl relative">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <button
                  onClick={togglePreviewModal}
                  className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-2xl font-bold text-blue-600">
                  Club Preview
                </h2>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                <div className="flex items-center space-x-4">
                  {clubDetails.logo ? (
                    <img
                      src={URL.createObjectURL(clubDetails.logo)}
                      alt="Club Logo"
                      className="w-20 h-20 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <ImageIcon className="text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {clubDetails.name || "Untitled Club"}
                    </h2>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Description
                  </h3>
                  <p className="text-gray-600">
                    {clubDetails.description || "No description provided"}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Coordinators
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {clubDetails.coordinators.map((coordId) => {
                      const coordinator = users.find((u) => u._id === coordId);
                      return (
                        <div
                          key={coordId}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                        >
                          {coordinator?.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default CreateClubForm;
