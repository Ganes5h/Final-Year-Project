import React from "react";
import {
  Mail,
  Phone,
  Building2,
  IdCard,
  GraduationCap,
} from "lucide-react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user);

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <Icon className="h-8 w-8 p-1.5 rounded-lg bg-blue-50 text-blue-600" />
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
          <div className="relative px-4 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
              {/* Profile Image */}
              <div className="-mt-16 md:-mt-24">
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-xl border-4 border-white shadow-lg object-cover"
                />
              </div>
              {/* Name and Role */}
              <div className="mt-4 md:mt-0 md:mb-4 flex-grow">
                <h1 className="text-3xl text-start font-bold text-gray-900">
                  {user.name}
                </h1>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 capitalize">
                    {user.role.replace("_", " ")}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Building2 className="w-4 h-4 mr-1" />
                    {user.department}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <InfoItem icon={Mail} label="Email Address" value={user.email} />
          <InfoItem icon={Phone} label="Phone Number" value={user.phone} />
          <InfoItem
            icon={IdCard}
            label="Registration Number"
            value={user.registrationNumber}
          />
          <InfoItem
            icon={Building2}
            label="Department"
            value={user.department}
          />
        </div>

        {/* Academic Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Academic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-blue-100 transition-all duration-300">
              <p className="text-sm font-medium text-gray-500 mb-1">
                Department
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {user.department}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-blue-100 transition-all duration-300">
              <p className="text-sm font-medium text-gray-500 mb-1">
                Registration Number
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {user.registrationNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
