import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import BaseUrl from "../../BaseUrl/BaseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useCallback } from "react";

const RevokeCertificate = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  // const [revokeReason, setRevokeReason] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const { user } = useSelector((state) => state.auth);

  const [revokedParticipants, setRevokedParticipants] = useState([]);
  const [showRevokedStudents, setShowRevokedStudents] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/event/allEvents`);
        setEvents(response.data.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to fetch events");
      }
    };
    fetchEvents();
  }, []);

  const handleViewMore = async (event) => {
    try {
      const response = await axios.get(
        `${BaseUrl}/certificate/getCertificateByEvents/${event._id}`
      );

      // Transform the certificates to match the previous structure
      const formattedCertificates = response.data.certificates.map((cert) => ({
        _id: cert._id,
        certificateId: cert.certificateId,
        certificateIssued: true, // Assuming all retrieved certificates are issued
        student: {
          name: cert.student.name,
          email: cert.student.email,
          registrationNumber: cert.student.registrationNumber,
        },
        registrationDate: new Date().toISOString(),
        status: cert.status,
      }));

      setParticipants(formattedCertificates);
      setSelectedEvent(event);
      setShowDetails(true);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("No students revoked");
    }
  };

  //   const handleReasonChange = (e) => {
  //     console.log('Current input:', e.target.value);
  //     setRevokeReason(e.target.value);
  //   };

  // const handleReasonChange = useCallback((e) => {
  //   setRevokeReason(e.target.value);
  // }, []);

  const openRevokeModal = (certificate) => {
    setSelectedCertificate(certificate);
    setIsRevokeModalOpen(true);
  };

  const handleRevokeCertificate = async () => {
    if (!selectedCertificate) {
      toast.error("Please provide a reason for revocation");
      return;
    }

    try {
      const updData = {
        certificateId: selectedCertificate.certificateId,
        reason: "in valid certificate",
        revokedById: user._id,
      };

      console.log(updData);

      const response = await axios.post(
        `${BaseUrl}/certificate/revoke-certificate`,
        updData
      );

      console.log(response.data);

      // Close modal and reset states
      setIsRevokeModalOpen(false);
      // setRevokeReason("");
      setSelectedCertificate(null);
      toast.success("Certificate revoked successfully");

      // Optionally, refresh the participants list
      if (selectedEvent) {
        handleViewMore(selectedEvent);
      }
    } catch (error) {
      console.error("Error revoking certificate:", error);
      toast.error("Failed to revoke certificate");
    }
  };

  const fetchRevokedCertificates = async (eventId) => {
    try {
      const response = await axios.get(
        `${BaseUrl}/certificate/getRevokeCertificate/${eventId}`
      );

      setRevokedParticipants(response.data.event.revokedCertificates);
      setShowRevokedStudents(true);
    } catch (error) {
      console.error("Error fetching revoked certificates:", error);
      toast.error("No Revoked Certificate");
    }
  };

  const RevokeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">
          Are you sure you want to revoke Certificate ??
        </h2>
        {/* <textarea
          className="w-full p-2 border rounded mb-4"
          rows="4"
          placeholder="Enter reason for certificate revocation"
          value={revokeReason}
          onChange={handleReasonChange}
        /> */}
        <div className="flex justify-evenly space-x-2">
          <button
            onClick={() => setIsRevokeModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleRevokeCertificate}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Revoke
          </button>
        </div>
      </div>
    </div>
  );

  const EventDetails = ({ event }) => (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-blue-600">{event.title}</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => fetchRevokedCertificates(event._id)}
                className="flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-all duration-200"
              >
                Revoked Students
              </button>
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
          </div>

          <div className="space-y-6">
            {/* Participants Table */}

            {!showRevokedStudents ? (
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
                          Registration Number
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {participants
                        .filter(
                          (participant) => participant.status === "active"
                        )
                        .map((participant) => (
                          <tr
                            key={participant._id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {participant.student.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {participant.student.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {participant.student.registrationNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                              <button
                                onClick={() => openRevokeModal(participant)}
                                className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded-full"
                              >
                                Revoke
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Revoked Participants Table */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4 text-red-600">
                    Revoked Students
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-red-50">
                        <tr>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Registration Number
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {revokedParticipants.map((participant) => (
                          <tr key={participant._id} className="hover:bg-red-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {participant.student.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {participant.student.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {participant.student.registrationNumber}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // const handleBack = () => {
  //   setShowDetails(false);
  //   setSelectedEvent(null);
  //   setParticipants([]);
  // };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedEvent(null);
    setParticipants([]);
    setShowRevokedStudents(false);
    setRevokedParticipants([]);
  };

  if (showDetails && selectedEvent) {
    return (
      <>
        <EventDetails event={selectedEvent} />
        {isRevokeModalOpen && <RevokeModal />}
      </>
    );
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
              <div className="flex justify-evenly p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
                <button
                  onClick={() => handleViewMore(event)}
                  className="inline-flex  items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:translate-x-1"
                >
                  View Students
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
      <ToastContainer />
    </div>
  );
};

export default RevokeCertificate;
