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
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6" dir="rtl">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">إدارة حالة الهوية</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">تفعيل الهوية</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsValid(!isValid)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      isValid ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isValid ? "-translate-x-6" : "-translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium text-gray-600">
                    {isValid ? "الهوية مفعلة حالياً" : "الهوية معطلة يدوياً"}
                  </span>
                </div>
                {expired && isValid && (
                  <p className="text-xs text-orange-600 mt-2 font-medium">ملاحظة: الهوية تعتبر منتهية زمنياً بحسب سنة الصدور رغم تفعيلها يدوياً.</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">رسالة مخصصة (اختياري)</label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="مثال: تم إيقاف الهوية لعدم تسديد الرسوم السنوية..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 h-24 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">ستظهر هذه الرسالة للمستخدمين عند مسح الهوية بدلاً من الرسالة الافتراضية.</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200"
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
