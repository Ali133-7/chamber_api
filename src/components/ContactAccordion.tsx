"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, ChevronDown } from "lucide-react";

interface ContactProps {
  phone: string;
  email: string;
  mapUrl: string;
}

export default function ContactAccordion({ phone, email, mapUrl }: ContactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasAnyContact = phone || email || mapUrl;

  return (
    <div className="w-full max-w-lg mt-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between focus:outline-none hover:bg-white/50 transition-colors"
      >
        <h3 className="text-lg font-bold text-gray-700">للتواصل والمراجعة</h3>
        <ChevronDown 
          className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} 
        />
      </button>

      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-wrap justify-center gap-4 px-6 pt-2 border-t border-gray-100/50">
          
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 text-gray-800 hover:bg-gray-50 hover:shadow-md transition-all font-bold">
              <Phone className="w-5 h-5 text-blue-600" />
              <span dir="ltr">{phone}</span>
            </a>
          )}
          
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 text-gray-800 hover:bg-gray-50 hover:shadow-md transition-all font-bold">
              <Mail className="w-5 h-5 text-blue-600" />
              <span>البريد الإلكتروني</span>
            </a>
          )}
          
          {mapUrl && (
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 text-gray-800 hover:bg-gray-50 hover:shadow-md transition-all font-bold">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>موقع الغرفة</span>
            </a>
          )}

          {!hasAnyContact && (
            <p className="text-gray-500 text-sm">الرجاء مراجعة مقر الغرفة الرئيسي.</p>
          )}

        </div>
      </div>
    </div>
  );
}
