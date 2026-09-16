"use client";

import { useState } from "react";
import { isMemberExpired } from "@/lib/expiration";

interface MemberStatusToggleProps {
  member: {
    id: string;
    isValid: boolean;
    memberNumber: string;
    createdAt: Date;
    customMessage: string | null;
  };
}

export default function MemberStatusToggle({ member }: MemberStatusToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isValid, setIsValid] = useState(member.isValid);
  const [customMessage, setCustomMessage] = useState(member.customMessage || "");
  const [loading, setLoading] = useState(false);

  const expired = isMemberExpired(member.memberNumber, new Date(member.createdAt));
  const effectivelyValid = isValid && !expired;

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/members/${member.id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isValid, customMessage }),
      });

      if (!res.ok) {
        alert("فصل في تحديث حالة التاجر.");
      } else {
        setIsOpen(false);
      }
    } catch (error) {
      alert("حدث خطأ أثناء الاتصال.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors border ${
            expired ? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100" 
            : effectivelyValid ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
            : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
          }`}
        >
          {expired ? "منتهية (إدارة)" : effectivelyValid ? "سارية (إدارة)" : "ملغاة (إدارة)"}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8" dir="rtl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">إدارة حالة الهوية</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">حالة التفعيل:</label>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <button
                    onClick={() => setIsValid(!isValid)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
                      isValid ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm ${
                        isValid ? "-translate-x-7" : "-translate-x-1"
                      }`}
                    />
                  </button>
                  <span className={`text-base font-bold ${isValid ? "text-green-700" : "text-gray-600"}`}>
                    {isValid ? "الهوية مفعلة حالياً" : "الهوية معطلة يدوياً"}
                  </span>
                </div>
                {expired && isValid && (
                  <p className="text-sm text-orange-600 mt-2 font-bold bg-orange-50 p-2 rounded">⚠️ ملاحظة: الهوية تعتبر منتهية زمنياً بحسب سنة الصدور رغم تفعيلها يدوياً.</p>
                )}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-2">رسالة مخصصة (اختياري):</label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="مثال: تم إيقاف الهوية لعدم تسديد الرسوم السنوية..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 h-32 text-base resize-none"
                />
                <p className="text-sm text-gray-500 mt-2 font-medium">ستظهر هذه الرسالة للمستخدمين عند مسح الهوية بدلاً من الرسالة الافتراضية.</p>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white font-bold text-lg py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md"
              >
                {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsValid(member.isValid); // reset
                  setCustomMessage(member.customMessage || "");
                }}
                disabled={loading}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-bold text-lg rounded-xl hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
