import React, { useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  XCircleIcon,
  X,
  Calendar,
  Users,
  MapPin,
  Award,
  Link2,
} from "lucide-react";

import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import TodayIcon from "@mui/icons-material/Today";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import BaseUrl from "../../BaseUrl/BaseUrl";

function CreateEvent() {
  const { user, club } = useSelector((state) => state.auth);

  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    club: club._id,
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    maxParticipants: null,
    activityPoints: null,
    venue: "",
    whatsappLink: "",
    status: "upcoming",
    createdBy: user?._id,
  });

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "startDate" ||
      name === "endDate" ||
      name === "registrationDeadline"
    ) {
      setEventDetails({
        ...eventDetails,
        [name]: value + ":00Z",
      });
    } else {
      setEventDetails({ ...eventDetails, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedEventDetails = {
      ...eventDetails,
      maxParticipants: Number(eventDetails.maxParticipants),
      activityPoints: Number(eventDetails.activityPoints),
      createdBy: String(eventDetails.createdBy),
    };

    axios
      .post(`${BaseUrl}/notifications/create-event`, updatedEventDetails)
      .then((response) => {
        console.log("Event created successfully:", response.data);
        toast.success("Event Created Successfully");
        setEventDetails({
          title: "",
          description: "",
          club: club._id,
          startDate: "",
          endDate: "",
          registrationDeadline: "",
          maxParticipants: null,
          activityPoints: null,
          venue: "",
          whatsappLink: "",
          status: "upcoming",
          createdBy: user?._id,
        });
      })
      .catch((error) => {
        console.error("There was an error creating the event:", error);
        toast.error(error || "An error occurred. Please try again.");
      });
  };

  const togglePreviewModal = () => {
    setShowPreviewModal(!showPreviewModal);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl mt-10">
      <div className="bg-blue-500 text-white py-6 px-8 rounded-t-lg">
        <h1 className="text-3xl font-bold">
          Create Event {<TodayIcon fontSize="large" />}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-8">
        {/* Basic Event Details */}
        <div>
          <label className="block text-sm text-start font-medium">
            Event Title*
          </label>
          <input
            type="text"
            name="title"
            value={eventDetails.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-start font-medium">
            Description*
          </label>
          <textarea
            name="description"
            value={eventDetails.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-start font-medium">
              Start Date*
            </label>
            <input
              type="datetime-local"
              name="startDate"
              value={
                eventDetails.startDate
                  ? eventDetails.startDate.slice(0, 16)
                  : ""
              }
              onChange={handleChange}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-start font-medium">
              End Date*
            </label>
            <input
              type="datetime-local"
              name="endDate"
              value={
                eventDetails.endDate ? eventDetails.endDate.slice(0, 16) : ""
              }
              onChange={handleChange}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-start font-medium">
              Registration Deadline*
            </label>
            <input
              type="datetime-local"
              name="registrationDeadline"
              value={
                eventDetails.registrationDeadline
                  ? eventDetails.registrationDeadline.slice(0, 16)
                  : ""
              }
              onChange={handleChange}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-start font-medium">
              Max Participants*
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={eventDetails.maxParticipants}
              onChange={handleChange}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-start font-medium">
              Activity Points*
            </label>
            <input
              type="number"
              name="activityPoints"
              value={eventDetails.activityPoints}
              onChange={handleChange}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-start font-medium">
              Venue*
            </label>
            <input
              type="text"
              name="venue"
              value={eventDetails.venue}
              onChange={handleChange}
              className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-start font-medium">
            WhatsApp Link*
          </label>
          <input
            type="url"
            name="whatsappLink"
            value={eventDetails.whatsappLink}
            onChange={handleChange}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600"
          >
            Create Event
          </button>
          <button
            type="button"
            onClick={togglePreviewModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600"
          >
            Preview
            <VisibilityOutlinedIcon className="ms-2" />
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
                  Event Preview
                </h2>
              </div>

              {/* Content */}
              <div className="max-h-[70vh] overflow-y-auto">
                <div className="p-6 space-y-8">
                  {/* Main Event Details */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {eventDetails.title || "Untitled Event"}
                    </h2>
                    <p className="text-gray-600">
                      {eventDetails.description || "No description provided"}
                    </p>

                    {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Club ID: {eventDetails.club}
                    </span> */}
                  </div>

                  <div className="h-px bg-gray-200" />

                  {/* Event Timing & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Start Date
                        </p>
                        <p className="text-gray-600">
                          {eventDetails.startDate || "Not set"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">End Date</p>
                        <p className="text-gray-600">
                          {eventDetails.endDate || "Not set"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Registration Deadline
                        </p>
                        <p className="text-gray-600 text-start">
                          {eventDetails.registrationDeadline || "Not set"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Venue</p>
                        <p className="text-gray-600">
                          {eventDetails.venue || "TBA"}
                        </p>
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
                        <p className="font-semibold text-gray-900">
                          Max Participants
                        </p>
                        <p className="text-gray-600">
                          {eventDetails.maxParticipants || "0"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Award className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Activity Points
                        </p>
                        <p className="text-gray-600">
                          {eventDetails.activityPoints || "0"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:col-span-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Link2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          WhatsApp Group
                        </p>
                        <a
                          href={eventDetails.whatsappLink}
                          className="text-blue-600 hover:underline truncate block"
                        >
                          {eventDetails.whatsappLink || "Not available"}
                        </a>
                      </div>
                    </div>
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
}

export default CreateEvent;
