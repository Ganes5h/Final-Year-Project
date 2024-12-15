import React, { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Box, IconButton } from "@material-ui/core";
import CloseIcon from "@mui/icons-material/Close";
import { Users, Building2, CalendarCheck } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseUrl from "../../BaseUrl/BaseUrl";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Rotaract from "../../assets/rotaract.png";

const ViewClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/admin/clubs`);
        setClubs(response.data.clubs);
        console.log(clubs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        toast.error("Failed to fetch clubs");
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const togglePreviewModal = () => {
    setShowPreviewModal(!showPreviewModal);
  };

  const handleViewMore = (club) => {
    setSelectedClub(club);
    togglePreviewModal();
  };

  //   const getClubLogo = (logo) => {
  //     return logo ? `${BaseUrl}/uploads/clubLogos/${logo}` : Rotaract;
  //   };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        Our Clubs
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
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-300 to-purple-300 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

              <div className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                {/* Logo Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    // src={getClubLogo(club.logo)}
                    src={Rotaract}
                    alt={`${club.name} Logo`}
                    className="w-full h-full object-cover object-center absolute inset-0 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                </div>

                <div className="p-6 pt-4">
                  <h2 className="text-2xl font-bold mb-3 text-blue-700 hover:text-purple-700 transition-colors duration-200">
                    {club.name}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {club.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      <Building2 className="w-4 h-4 mr-2" />
                      Club ID: {club._id.slice(-6)}
                    </div>

                    <button
                      onClick={() => handleViewMore(club)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:translate-x-1"
                    >
                      See More
                      <EventNoteIcon fontSize="medium" className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedClub && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl relative">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 relative">
                <Box position="relative">
                  <IconButton
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={togglePreviewModal}
                    style={{ position: "absolute", top: "16px", right: "16px" }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Typography variant="h4" className="text-blue-600 font-bold">
                  Club Details
                </Typography>
              </div>

              {/* Logo Section in Modal */}
              <div className="h-64 overflow-hidden relative">
                <img
                  //   src={getClubLogo(selectedClub.logo)}
                  src={Rotaract}
                  alt={`${selectedClub.name} Logo`}
                  className="w-full h-full object-cover object-center absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
              </div>

              {/* Modal Content */}
              <div className="max-h-[70vh] overflow-y-auto p-6 space-y-8">
                {/* Main Club Details */}
                <div className="space-y-4">
                  <Typography variant="h4" className="font-bold">
                    {selectedClub.name}
                  </Typography>
                  <Typography variant="body1" className="text-gray-600">
                    {selectedClub.description}
                  </Typography>

                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                    <Typography variant="body2">
                      Club ID: {selectedClub._id}
                    </Typography>
                  </div>
                </div>

                <div className="h-px bg-gray-200" />

                {/* Coordinators */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <Typography
                      variant="h6"
                      className="font-bold text-gray-900"
                    >
                      Coordinators
                    </Typography>
                  </div>

                  {selectedClub.coordinators.length > 0 ? (
                    selectedClub.coordinators.map((coordinator) => (
                      <div
                        key={coordinator._id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <Typography variant="subtitle1" className="font-medium">
                          {coordinator.name}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {coordinator.email}
                        </Typography>
                      </div>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      className="text-gray-500 italic"
                    >
                      No coordinators assigned.
                    </Typography>
                  )}
                </div>

                <div className="h-px bg-gray-200" />

                {/* Events */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CalendarCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <Typography
                      variant="h6"
                      className="font-bold text-gray-900"
                    >
                      Events
                    </Typography>
                  </div>

                  {selectedClub.events.length > 0 ? (
                    selectedClub.events.map((event) => (
                      <div
                        key={event._id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <Typography variant="subtitle1" className="font-medium">
                          {event.title}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {event.description}
                        </Typography>
                      </div>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      className="text-gray-500 italic"
                    >
                      No events have been created for this club yet.
                    </Typography>
                  )}
                </div>

                {/* Additional Details */}
                <div className="h-px bg-gray-200" />
                <div className="space-y-4">
                  <div>
                    <Typography variant="subtitle1" className="font-semibold">
                      Created By
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {selectedClub.createdBy.name} (
                      {selectedClub.createdBy.email})
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle1" className="font-semibold">
                      Created At
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {new Date(selectedClub.createdAt).toLocaleString()}
                    </Typography>
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

export default ViewClubs;
