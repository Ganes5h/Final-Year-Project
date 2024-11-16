import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Chip,
  Box,
} from "@material-ui/core";
import {
  Calendar,
  Users,
  MapPin,
  Award,
  Link2,
  X,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/event/allEvents"
        );
        setEvents(response.data.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const togglePreviewModal = () => {
    setShowPreviewModal(!showPreviewModal);
  };

  const handleViewMore = (event) => {
    setSelectedEvent(event);
    togglePreviewModal();
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div className="relative max-w-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            {/* Gradient border using pseudo-elements */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-300 to-purple-300 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

            {/* Main card container */}
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-0">
              {/* Decorative top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

              {/* Card content */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-blue-600 hover:text-purple-600 transition-colors duration-200">
                  {event.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                  {event.description}
                </p>

                <div className="flex items-center gap-4 mb-1">
                  <div className="flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {new Date(event.startDate).toLocaleDateString()}
                  </div>

                  <div className="flex items-center bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {new Date(event.startDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              {/* Card actions */}
              <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
                <button
                  onClick={() => handleViewMore(event)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:translate-x-1"
                >
                  SEE MORE
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedEvent && (
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
                  Event Details
                </Typography>
              </div>

              {/* Content */}
              <div className="max-h-[70vh] overflow-y-auto">
                <div className="p-6 space-y-8">
                  {/* Main Event Details */}
                  <div className="space-y-4">
                    <Typography variant="h4" className="font-bold">
                      {selectedEvent.title}
                    </Typography>
                    <Typography variant="body1" className="text-gray-600">
                      {selectedEvent.description}
                    </Typography>

                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                      <Typography variant="body2">
                        Club: {selectedEvent.club.name}
                      </Typography>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200" />

                  {/* Event Timing & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <Typography
                          variant="subtitle1"
                          className="font-semibold"
                        >
                          Start Date
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {new Date(selectedEvent.startDate).toLocaleString()}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <Typography
                          variant="subtitle1"
                          className="font-semibold"
                        >
                          End Date
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {new Date(selectedEvent.endDate).toLocaleString()}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <Typography
                          variant="subtitle1"
                          className="font-semibold"
                        >
                          Registration Deadline
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {new Date(
                            selectedEvent.registrationDeadline
                          ).toLocaleString()}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <Typography
                          variant="subtitle1"
                          className="font-semibold"
                        >
                          Venue
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {selectedEvent.venue}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200" />

                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <Typography
                          variant="subtitle1"
                          className="font-semibold"
                        >
                          Max Participants
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {selectedEvent.maxParticipants}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Award className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <Typography
                          variant="subtitle1"
                          className="font-semibold"
                        >
                          Activity Points
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          {selectedEvent.activityPoints}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:col-span-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Link2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <Typography
                          variant="subtitle1"
                          className="font-semibold"
                        >
                          WhatsApp Group
                        </Typography>
                        <a
                          href={selectedEvent.whatsappLink}
                          className="text-blue-600 hover:underline truncate block"
                        >
                          {selectedEvent.whatsappLink || "Not available"}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200" />

                  {/* Additional Details */}
                  <div className="space-y-4">
                    <div>
                      <Typography variant="subtitle1" className="font-semibold">
                        Created By
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {selectedEvent.createdBy.name} (
                        {selectedEvent.createdBy.email})
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle1" className="font-semibold">
                        Created At
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {new Date(selectedEvent.createdAt).toLocaleString()}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle1" className="font-semibold">
                        Last Updated
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        {new Date(selectedEvent.updatedAt).toLocaleString()}
                      </Typography>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-evenly pt-4">
                    <Button
                      variant="contained"
                      color="primary"
                      className="bg-blue-500 hover:bg-blue-600"
                      startIcon={<PencilIcon className="h-4 w-4" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      className="bg-red-500 hover:bg-red-600"
                      startIcon={<TrashIcon className="h-4 w-4" />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewEvents;
