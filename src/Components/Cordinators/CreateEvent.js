import React, { useState } from "react";

function CreateEvent() {
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    club: "",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    maxParticipants: "",
    activityPoints: "",
    venue: "",
    whatsappLink: "",
    registrationForm: {
      fields: [{ name: "", type: "text", required: false, options: [] }],
    },
    status: "upcoming",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleFieldChange = (index, e) => {
    const { name, value } = e.target;
    const fields = [...eventDetails.registrationForm.fields];
    fields[index][name] = value;
    setEventDetails({ ...eventDetails, registrationForm: { fields } });
  };

  const addField = () => {
    setEventDetails({
      ...eventDetails,
      registrationForm: {
        fields: [
          ...eventDetails.registrationForm.fields,
          { name: "", type: "text", required: false, options: [] },
        ],
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(eventDetails);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-6 px-8">
          <p className="mt-2 text-blue-100">
            Fill in the details below to create a new event
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          {/* Basic Event Details Section */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm text-start font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={eventDetails.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-start font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={eventDetails.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-start text-gray-700 mb-1">
                Club ID
              </label>
              <input
                type="text"
                name="club"
                value={eventDetails.club}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-start text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={eventDetails.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-start font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={eventDetails.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-start font-medium text-gray-700 mb-1">
                  Registration Deadline
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={eventDetails.registrationDeadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-start text-sm font-medium text-gray-700 mb-1">
                  Max Participants
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={eventDetails.maxParticipants}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-start text-sm font-medium text-gray-700 mb-1">
                  Activity Points
                </label>
                <input
                  type="number"
                  name="activityPoints"
                  value={eventDetails.activityPoints}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-start font-medium text-gray-700 mb-1">
                  Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  value={eventDetails.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-start font-medium text-gray-700 mb-1">
                WhatsApp Link
              </label>
              <input
                type="url"
                name="whatsappLink"
                value={eventDetails.whatsappLink}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Registration Form Fields Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Registration Form Fields
              </h2>
              <button
                type="button"
                onClick={addField}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-150 ease-in-out"
              >
                Add Field
              </button>
            </div>

            <div className="space-y-4">
              {eventDetails.registrationForm.fields.map((field, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-start font-medium text-gray-700 mb-1">
                        Field Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={field.name}
                        onChange={(e) => handleFieldChange(index, e)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-start font-medium text-gray-700 mb-1">
                        Field Type
                      </label>
                      <select
                        name="type"
                        value={field.type}
                        onChange={(e) => handleFieldChange(index, e)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="number">Number</option>
                        <option value="select">Select</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center">
                    <input
                      type="checkbox"
                      name="required"
                      checked={field.required}
                      onChange={(e) =>
                        handleFieldChange(index, {
                          ...e,
                          target: { name: "required", value: e.target.checked },
                        })
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Required field
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-150 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
