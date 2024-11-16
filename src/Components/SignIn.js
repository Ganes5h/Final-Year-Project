import React, { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Timer,
  HeadphonesIcon,
} from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseUrl from "../BaseUrl/BaseUrl";

const SignIn = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Use effect to check if "remember me" data is available in localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset  loading state
    setLoading(true);

    const credentials = { email, password };

    try {
      const response = await axios.post(`${BaseUrl}/admin/login`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle successful login
      console.log("Logged in successfully:", response.data);

      // Save to localStorage if "remember me" is checked
      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password); // Note: In production, avoid saving passwords in localStorage
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }

      // Redirect to another page or handle user session
      window.location.href = "/dashboard-layout";
    } catch (err) {
      // Handle error
      if (err.response) {
        // If the error is from the server (response error)
        toast.error(
          err.response.data.message || "Login failed, please try again."
        );
      } else if (err.request) {
        // If no response is received from the server
        toast.error("Network error. Please try again later.");
      } else {
        // If some other error occurred
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <ShieldCheck className="w-12 h-12 text-blue-600" />,
      title: "Secure Verification",
      description: "Industry-leading security protocols",
    },
    {
      icon: <Timer className="w-12 h-12 text-blue-600" />,
      title: "Quick Certification",
      description: "Get certified in minutes",
    },
    {
      icon: <HeadphonesIcon className="w-12 h-12 text-blue-600" />,
      title: "24/7 Support",
      description: "Round-the-clock expert assistance",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-800">
                Secure Certify
              </span>
            </div>
            <button
              onClick={() => setShowSignIn(!showSignIn)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {showSignIn ? "Back to Home" : "Sign In"}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showSignIn ? (
          /* Landing Page Content */
          <div className="space-y-16">
            <div className="text-center space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                Secure Certification
                <span className="text-blue-600"> Made Simple</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your trusted platform for verified certifications. Fast, secure,
                and reliable.
              </p>
              <button
                onClick={() => setShowSignIn(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Get Started Now
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Sign In Form */
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl p-8">
            <div className="text-center mb-8">
              <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600">
                Sign in to your Secure Certify account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-start text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
                <a
                  href="/"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                  loading ? "bg-blue-400 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignIn;
