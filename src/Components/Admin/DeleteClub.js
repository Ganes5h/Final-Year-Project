import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Box, IconButton } from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseUrl from "../../BaseUrl/BaseUrl";
import Rotaract from "../../assets/rotaract.png";

const DeleteClub = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clubToDelete, setClubToDelete] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/admin/clubs`);
        setClubs(response.data.clubs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        toast.error("Failed to fetch clubs");
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const handleDeleteClub = async () => {
    if (!clubToDelete) return;

    try {
      await axios.delete(`${BaseUrl}/admin/clubs/${clubToDelete._id}`);

      // Remove the deleted club from the list
      setClubs(clubs.filter((club) => club._id !== clubToDelete._id));

      toast.success(`Club "${clubToDelete.name}" deleted successfully`);
      setShowDeleteModal(false);
      setClubToDelete(null);
    } catch (error) {
      console.error("Error deleting club:", error);
      toast.error("Failed to delete club");
    }
  };

  const openDeleteConfirmModal = (club) => {
    setClubToDelete(club);
    setShowDeleteModal(true);
  };

  const closeDeleteConfirmModal = () => {
    setShowDeleteModal(false);
    setClubToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* <h1 className="text-3xl font-bold text-center mb-8 text-red-700">
        Delete Clubs
      </h1> */}

      {clubs.length === 0 ? (
        <div className="text-center text-gray-500">
          No clubs found. Check back later.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div
              key={club._id}
              className="relative group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-300 to-pink-300 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

              <div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                {/* Logo Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={Rotaract}
                    alt={`${club.name} Logo`}
                    className="w-full h-full object-cover object-center absolute inset-0 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                </div>

                <div className="p-6 pt-4">
                  <h2 className="text-2xl font-bold mb-3 text-red-700 hover:text-red-900 transition-colors duration-200">
                    {club.name}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {club.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                      Club ID: {club._id.slice(-6)}
                    </div>

                    <button
                      onClick={() => openDeleteConfirmModal(club)}
                      className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 hover:translate-x-1"
                    >
                      Delete
                      <DeleteIcon fontSize="medium" className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && clubToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-700">
                Confirm Deletion
              </h2>
              <IconButton onClick={closeDeleteConfirmModal}>
                <CloseIcon />
              </IconButton>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">
                Are you sure you want to delete the club{" "}
                <span className="font-bold text-red-600">
                  {clubToDelete.name}
                </span>
                ?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone and will permanently remove the
                club.
              </p>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={closeDeleteConfirmModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClub}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Club
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default DeleteClub;
