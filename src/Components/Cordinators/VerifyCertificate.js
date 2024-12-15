import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import Swal from "sweetalert2";
import axios from "axios";
import { ArrowLeft, QrCode } from "lucide-react";
import BaseUrl from "../../BaseUrl/BaseUrl";

const VerifyCertificate = () => {
  const [scanResult, setScanResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  const handleScan = async (data) => {
    if (data && !hasScanned) {
      const qrData = data.text.split("/").pop(); // Extract the hash from the URL
      // console.log("Scanned Data:", qrData);

      setHasScanned(true); // Prevent further scans until reset

      try {
        const response = await axios.get(
          `${BaseUrl}/certificate/verify-certificate/${qrData}`
        );

        // console.log("Verification Successful:", response.data);

        Swal.fire({
          title: "Certificate Verified Successfully",
          html: `Event: <strong>${response.data.data.eventName}</strong><br>
                 Student: <strong>${response.data.data.studentName}</strong><br>
                 USN: <strong>${response.data.data.usn}</strong>`,
          icon: "success",
        }).then(() => {
          setHasScanned(false); // Reset after the Swal alert is closed
        });
      } catch (error) {
        // console.error("Verification Failed:", error);

        Swal.fire({
          title: "Invalid Certificate",
          text:
            error.response?.data?.message ||
            "An error occurred while verifying the certificate.",
          icon: "error",
        });
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    Swal.fire({
      title: "Scanner Error",
      text: "Failed to scan the QR code.",
      icon: "error",
    });
  };

  return (
    <div className=" bg-gray-50 flex items-center justify-center p-8">
      {/* Back Button */}
      <button className="absolute top-4 left-4 flex items-center space-x-2 bg-white rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-100">
        <ArrowLeft className="w-4 h-4" />
        <span>Go Back</span>
      </button>

      <div className="w-full max-w-md bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="p-4 pb-3">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <QrCode className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Scan Certificate
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-4">
          <div className="space-y-6">
            {/* Scanner Container */}
            <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-square max-w-sm mx-auto shadow-lg">
              <QrScanner
                delay={300}
                className="w-full h-full object-cover"
                onError={handleError}
                onScan={handleScan}
              />
              {/* Scanner Overlay */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-indigo-400 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-indigo-400 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-indigo-400 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-indigo-400 rounded-br-xl"></div>
              </div>
            </div>

            {/* Scan Result */}
            {scanResult && (
              <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-indigo-600">
                    Scanned Result:
                  </p>
                  <p className="font-medium text-gray-900 break-all">
                    {scanResult}
                  </p>
                  {loading && (
                    <p className="text-sm text-indigo-500 flex items-center space-x-2">
                      <span className="block w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                      <span>Verifying...</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Position the QR code within the frame to scan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
