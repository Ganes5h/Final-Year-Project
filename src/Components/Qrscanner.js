import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import Swal from "sweetalert2";
import { ArrowLeft, QrCode } from "lucide-react";

const Qrscanner = () => {
  const [scanResult, setScanResult] = useState("");

  const handleScan = async (data) => {
    if (data) {
      setScanResult(data.text);
      console.log(data.text);
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
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-600 flex items-center justify-center p-4">
      {/* Back Button */}
      <button className="absolute top-4 left-4 flex items-center space-x-2 bg-white rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-blue-50 hover:shadow-lg">
        <ArrowLeft className="w-4 h-4" />
        <span>Go Back</span>
      </button>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-center space-x-2">
            <QrCode className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Scan Certificate
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="space-y-6">
            {/* Scanner Container */}
            <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-square max-w-sm mx-auto">
              <QrScanner
                delay={300}
                className="w-full h-full object-cover"
                onError={handleError}
                onScan={handleScan}
              />
              {/* Scanner Overlay */}
              <div className="absolute inset-0 border-2 border-blue-400 opacity-50">
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-blue-500"></div>
              </div>
            </div>

            {/* Scan Result */}
            {scanResult && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Scanned Result:</p>
                <p className="font-medium text-gray-900 break-all">
                  {scanResult}
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="text-center text-sm text-gray-500">
              <p>Position the QR code within the frame to scan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Qrscanner;