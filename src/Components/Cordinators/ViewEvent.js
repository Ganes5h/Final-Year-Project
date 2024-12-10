import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
import { TextField } from "@material-ui/core";
import BaseUrl from "../../BaseUrl/BaseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/event/allEvents`);
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

  // const handleViewMore = async (event) => {
  //   try {
  //     // Fetch specific event details by ID
  //     const response = await axios.get(
  //       `${BaseUrl}/event/eventDetails/${event._id}`
  //     );

  //     console.log("Event Details Response:", response.data);

  //     const fullEventDetails = response.data.data.event;
  //     setSelectedEvent(fullEventDetails);
  //     togglePreviewModal();
  //   } catch (error) {
  //     console.error("Error fetching event details:", error);
  //   }
  // };

  const handleDeleteClick = () => {
    // Open delete confirmation modal
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      // Perform delete action
      await axios.delete(`${BaseUrl}/event/deleteEvent/${selectedEvent._id}`);

      // Remove the deleted event from the events list
      setEvents(events.filter((event) => event._id !== selectedEvent._id));
      // Close both modals
      setShowDeleteConfirmModal(false);
      setShowPreviewModal(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      // Optionally, show an error message to the user
    }
  };

  const handleDeleteCancel = () => {
    // Close delete confirmation modal
    setShowDeleteConfirmModal(false);
  };

  const handleEditClick = () => {
    // Create a copy of the selected event to edit
    setEditedEvent({ ...selectedEvent });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleEditSave = async () => {
  //   try {
  //     // Prepare the data to send - only send fields that can be edited
  //     const updateData = {
  //       title: editedEvent.title,
  //       description: editedEvent.description,
  //       startDate: editedEvent.startDate,
  //       endDate: editedEvent.endDate,
  //       registrationDeadline: editedEvent.registrationDeadline,
  //       venue: editedEvent.venue,
  //       maxParticipants: editedEvent.maxParticipants,
  //       activityPoints: editedEvent.activityPoints,
  //       whatsappLink: editedEvent.whatsappLink,
  //     };

  //       // Log the data being sent
  //   console.log("Update Data:", updateData);

  //     // Make PATCH request to update event
  //     const response = await axios.patch(
  //       `http://localhost:4000/api/event/updateEvent/${editedEvent._id}`,
  //       updateData
  //     );

  //     console.log("Update Response:", response.data);

  //     // Update the events list with the modified event
  //     setEvents((prevEvents) =>
  //       prevEvents.map((event) =>
  //         event._id === editedEvent._id ? { ...event, ...updateData } : event
  //       )
  //     );

  //     // Update the selected event
  //     setSelectedEvent((prev) => ({ ...prev, ...updateData }));

  //     // Close edit modal
  //     setShowEditModal(false);
  //   } catch (error) {
  //     console.error("Error updating event:", error);
  //   }
  // };

  const handleEditSave = async () => {
    try {
      // Prepare the data to send - only send fields that can be edited
      const updateData = {
        title: editedEvent.title,
        description: editedEvent.description,
        startDate: editedEvent.startDate,
        endDate: editedEvent.endDate,
        registrationDeadline: editedEvent.registrationDeadline,
        venue: editedEvent.venue,
        maxParticipants: editedEvent.maxParticipants,
        activityPoints: editedEvent.activityPoints, // Ensure this is included
        whatsappLink: editedEvent.whatsappLink,
      };

      // Log the data being sent
      console.log("Update Data:", updateData);

      // Make PATCH request to update event
      const response = await axios.patch(
        `http://localhost:4000/api/event/updateEvent/${editedEvent._id}`,
        updateData
      );

      console.log("Update Response:", response.data);
      toast.success("Event Saved Successfully");

      // Update the events list with the modified event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === editedEvent._id ? { ...event, ...updateData } : event
        )
      );

      // Directly update the selectedEvent with the new data
      setSelectedEvent((prev) => ({
        ...prev,
        ...updateData,
      }));

      // Close edit modal
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error(error || "An error occurred. Please try again.");
    }
  };

  const handleViewMore = async (event) => {
    try {
      // Fetch specific event details by ID
      const response = await axios.get(
        `${BaseUrl}/event/eventDetails/${event._id}`
      );

      console.log("Event Details Response:", response.data);

      const fullEventDetails = response.data.data.event;

      // Optional: Cross-check with local state to ensure most recent updates
      const localEventData = events.find((e) => e._id === event._id);

      // Merge server data with local updates if available
      const mergedEventDetails = localEventData
        ? { ...fullEventDetails, ...localEventData }
        : fullEventDetails;

      setSelectedEvent(mergedEventDetails);
      togglePreviewModal();
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditedEvent(null);
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
                      onClick={handleEditClick}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="contained"
                      color="secondary"
                      className="bg-red-500 hover:bg-red-600"
                      startIcon={<TrashIcon className="h-4 w-4" />}
                      onClick={handleDeleteClick}
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

      {/* Edit Modal */}
      {showEditModal && editedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-xl relative p-6">
              <div className="flex justify-between items-center mb-6">
                <Typography variant="h4" className="text-blue-600 font-bold">
                  Edit Event
                </Typography>
                <IconButton onClick={handleEditCancel}>
                  <CloseIcon />
                </IconButton>
              </div>

              <div className="space-y-4">
                <TextField
                  fullWidth
                  label="Event Title"
                  name="title"
                  value={editedEvent.title}
                  onChange={handleEditChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={editedEvent.description}
                  onChange={handleEditChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="datetime-local"
                  value={new Date(editedEvent.startDate)
                    .toISOString()
                    .slice(0, 16)}
                  onChange={handleEditChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="End Date"
                  name="endDate"
                  type="datetime-local"
                  value={new Date(editedEvent.endDate)
                    .toISOString()
                    .slice(0, 16)}
                  onChange={handleEditChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Registration Deadline"
                  name="registrationDeadline"
                  type="datetime-local"
                  value={new Date(editedEvent.registrationDeadline)
                    .toISOString()
                    .slice(0, 16)}
                  onChange={handleEditChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Venue"
                  name="venue"
                  value={editedEvent.venue}
                  onChange={handleEditChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Max Participants"
                  name="maxParticipants"
                  type="number"
                  value={editedEvent.maxParticipants}
                  onChange={handleEditChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Activity Points"
                  name="activityPoints"
                  type="number"
                  value={editedEvent.activityPoints}
                  onChange={handleEditChange}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="WhatsApp Group Link"
                  name="whatsappLink"
                  value={editedEvent.whatsappLink}
                  onChange={handleEditChange}
                  variant="outlined"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  variant="contained"
                  onClick={handleEditCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={showDeleteConfirmModal}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-confirmation-title"
        aria-describedby="delete-confirmation-description"
      >
        <DialogTitle id="delete-confirmation-title">
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirmation-description">
            Are you sure you want to delete the event "{selectedEvent?.title}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            No, Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default ViewEvents;
