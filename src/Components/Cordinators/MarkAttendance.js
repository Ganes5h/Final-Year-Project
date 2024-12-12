import React, { useState, useEffect } from "react";
import axios from "axios";
import BaseUrl from "../../BaseUrl/BaseUrl";

const MarkAttendance = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [participants, setParticipants] = useState([]);

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

  const handleViewMore = async (event) => {
    try {
      const [eventDetails, participantsData] = await Promise.all([
        axios.get(`${BaseUrl}/event/eventDetails/${event._id}`),
        axios.get(`${BaseUrl}/event/getParticipants/${event._id}`),
      ]);

      const fullEventDetails = eventDetails.data.data.event;
      const localEventData = events.find((e) => e._id === event._id);
      const mergedEventDetails = localEventData
        ? { ...fullEventDetails, ...localEventData }
        : fullEventDetails;

      setSelectedEvent(mergedEventDetails);
      setParticipants(participantsData.data.participants);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedEvent(null);
    setParticipants([]);
  };

  const toggleAttendance = async (participantId, studentId) => {
    try {
      // Update the UI optimistically
      setParticipants(
        participants.map((p) =>
          p._id === participantId ? { ...p, attendance: !p.attendance } : p
        )
      );

      // Make the API call with event ID and participant ID
      const eventId = selectedEvent._id;
      // console.log(eventId);
      // console.log(studentId);
      await axios.get(
        `${BaseUrl}/event/markAttendance/${eventId}/${studentId}`
      );
      // console.log(res);
    } catch (error) {
      console.error("Error updating attendance:", error);
      // Revert the optimistic update if the API call fails
      setParticipants(
        participants.map((p) =>
          p._id === participantId ? { ...p, attendance: !p.attendance } : p
        )
      );
    }
  };

  // const toggleCertificate = async (participantId) => {
  //   try {
  //     // Update the UI optimistically
  //     setParticipants(
  //       participants.map((p) =>
  //         p._id === participantId
  //           ? { ...p, certificateIssued: !p.certificateIssued }
  //           : p
  //       )
  //     );

  //     // Here you would typically make an API call to update the certificate status
  //     // await axios.post(`${BaseUrl}/event/updateCertificate/${participantId}`);
  //   } catch (error) {
  //     console.error("Error updating certificate status:", error);
  //     // Revert the optimistic update if the API call fails
  //   }
  // };

  const EventDetails = ({ event }) => (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-blue-600">{event.title}</h1>
            <button
              onClick={handleBack}
              className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Events
            </button>
          </div>

          <div className="space-y-6">
            {/* Participants Table */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Participants</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendance
                      </th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"> Certificate  </th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {participants.map((participant) => (
                      <tr key={participant._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {participant.student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {participant.student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(
                            participant.registrationDate
                          ).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() =>
                              toggleAttendance(
                                participant._id,
                                participant.student._id
                              )
                            }
                            className={`px-3 py-1 rounded-full text-sm ${
                              participant.attendance
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                          >
                            {participant.attendance ? "Present" : "Not Present"}
                          </button>
                        </td>
                        {/* <td>
                          <button
                            onClick={() => toggleCertificate(participant._id)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              participant.certificateIssued
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            }`}
                          >
                            {participant.certificateIssued
                              ? "Issued"
                              : "Not Issued"}
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (showDetails && selectedEvent) {
    return <EventDetails event={selectedEvent} />;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="relative max-w-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-300 to-purple-300 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-0">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

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
    </div>
  );
};

export default MarkAttendance;
