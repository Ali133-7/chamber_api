"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QrThumbnail({ token, memberName }: { token: string, memberName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    // Generate the full URL dynamically based on the current window location
    setQrUrl(`${window.location.origin}/verify/${token}`);
  }, [token]);

  if (!qrUrl) return null;

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="cursor-pointer hover:opacity-80 transition-opacity border p-1 rounded bg-white inline-block shadow-sm"
        title="انقر لتكبير رمز الاستجابة السريعة (QR Code)"
      >
        <QRCodeSVG value={qrUrl} size={32} />
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)} // Close when clicking backdrop
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              كود التحقق الخاص بـ
              <br/>
              <span className="text-blue-600">{memberName}</span>
            </h3>
            
            <div className="bg-white p-4 border-2 border-gray-100 rounded-xl shadow-inner mb-6">
              <QRCodeSVG value={qrUrl} size={250} />
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-gray-100 text-gray-800 font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
}
