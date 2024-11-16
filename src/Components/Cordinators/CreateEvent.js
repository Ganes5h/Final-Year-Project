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
  FormInput,
} from "lucide-react";

function CreateEvent() {
  // [Previous state and handlers remain the same until the return statement]
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

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // [All your existing handlers remain the same]
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

  const removeField = (index) => {
    const fields = [...eventDetails.registrationForm.fields];
    fields.splice(index, 1);
    setEventDetails({ ...eventDetails, registrationForm: { fields } });
  };

  const addOption = (index) => {
    const fields = [...eventDetails.registrationForm.fields];
    fields[index].options.push("");
    setEventDetails({ ...eventDetails, registrationForm: { fields } });
  };

  const removeOption = (fieldIndex, optionIndex) => {
    const fields = [...eventDetails.registrationForm.fields];
    fields[fieldIndex].options.splice(optionIndex, 1);
    setEventDetails({ ...eventDetails, registrationForm: { fields } });
  };

  const handleOptionChange = (fieldIndex, optionIndex, value) => {
    const fields = [...eventDetails.registrationForm.fields];
    fields[fieldIndex].options[optionIndex] = value;
    setEventDetails({ ...eventDetails, registrationForm: { fields } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(eventDetails);
  };

  const togglePreviewModal = () => {
    setShowPreviewModal(!showPreviewModal);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl mt-10">
      <div className="bg-blue-500 text-white py-6 px-8 rounded-t-lg">
        <h1 className="text-3xl font-bold">Create Event</h1>
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

        <div>
          <label className="block text-sm text-start font-medium">
            Club ID*
          </label>
          <input
            type="text"
            name="club"
            value={eventDetails.club}
            onChange={handleChange}
            className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-start font-medium">
              Start Date*
            </label>
            <input
              type="date"
              name="startDate"
              value={eventDetails.startDate}
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
              type="date"
              name="endDate"
              value={eventDetails.endDate}
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
              type="date"
              name="registrationDeadline"
              value={eventDetails.registrationDeadline}
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

        {/* Registration Form Fields */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Registration Form Fields</h2>
          {eventDetails.registrationForm.fields.map((field, index) => (
            <div key={index} className="border rounded-md p-6 mb-4 relative">
              <button
                type="button"
                onClick={() => removeField(index)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <XCircleIcon size={20} />
              </button>
              <div>
                <label className="block text-sm text-start font-medium">
                  Field Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={field.name}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm text-start font-medium">
                  Field Type
                </label>
                <select
                  name="type"
                  value={field.type}
                  onChange={(e) => handleFieldChange(index, e)}
                  className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                </select>
              </div>
              <div className="mt-4 flex">
                <label className="block text-sm justify-start font-medium mr-2">
                  Required
                </label>
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
                />
              </div>
              {/* Conditional Options Section */}
              {(field.type === "select" || field.type === "checkbox") && (
                <div className="mt-4">
                  {/* <label className="block text-sm font-medium">Options</label> */}
                  {field.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center mt-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, optionIndex, e.target.value)
                        }
                        className="w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mr-2"
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(index, optionIndex)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <XCircleIcon size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(index)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add Option
                  </button>
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-start">
            <button
              type="button"
              onClick={addField}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Field
            </button>
          </div>
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

      {/* New Preview Modal */}

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
                  {/* Event Details Section - Keep existing code until Registration Form Fields */}

                  {/* Main Event Details */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {eventDetails.title || "Untitled Event"}
                    </h2>
                    <p className="text-gray-600">
                      {eventDetails.description || "No description provided"}
                    </p>

                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      Club ID: {eventDetails.club}
                    </span>
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

                  <div className="h-px bg-gray-200" />

                  {/* Registration Form Fields - Modified Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <FormInput className="h-5 w-5 text-indigo-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Registration Form
                      </h3>
                    </div>

                    <form className="space-y-6">
                      {eventDetails.registrationForm.fields.map(
                        (field, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <label className="block mb-2 text-start">
                              <span className="font-medium text-gray-900">
                                {field.name || `Field ${index + 1}`}
                                {field.required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </span>

                              {field.type === "text" && (
                                <input
                                  type="text"
                                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                  required={field.required}
                                />
                              )}

                              {field.type === "email" && (
                                <input
                                  type="email"
                                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                  required={field.required}
                                />
                              )}

                              {field.type === "number" && (
                                <input
                                  type="number"
                                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                  required={field.required}
                                />
                              )}

                              {field.type === "select" && (
                                <select
                                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                  required={field.required}
                                >
                                  <option value="">Select an option</option>
                                  {field.options.map((option, idx) => (
                                    <option key={idx} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              )}

                              {field.type === "checkbox" && (
                                <div className="mt-2 space-y-2">
                                  {field.options.map((option, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center"
                                    >
                                      <input
                                        type="checkbox"
                                        id={`${field.name}-${idx}`}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <label
                                        htmlFor={`${field.name}-${idx}`}
                                        className="ml-2 text-gray-700"
                                      >
                                        {option}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </label>
                          </div>
                        )
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateEvent;
