"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "كلمتا المرور الجديدتان غير متطابقتين" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "حدث خطأ ما");
      }

      setMessage({ type: "success", text: "تم تغيير كلمة المرور بنجاح!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mt-8">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <Lock className="w-6 h-6 text-gray-700" />
        <h2 className="text-xl font-extrabold text-gray-800">تغيير كلمة المرور لحساب الإدارة</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        {message.text && (
          <div className={`p-4 rounded-xl font-bold ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message.text}
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور الحالية</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            dir="ltr"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-semibold"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور الجديدة</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            dir="ltr"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-semibold"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">تأكيد كلمة المرور الجديدة</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            dir="ltr"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-semibold"
            placeholder="••••••••"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 disabled:opacity-50 transition w-full md:w-auto shadow-md"
          >
            {loading ? "جاري التغيير..." : "تحديث كلمة المرور"}
          </button>
        </div>
      </form>
    </div>
  );
}
