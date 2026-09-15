"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  const [config, setConfig] = useState({
    pageTitle: "",
    validBgColor: "",
    invalidBgColor: "",
    logoUrl: "",
    validMessage: "",
    invalidMessage: "",
    primaryColor: "",
    dangerColor: "",
  });

  useEffect(() => {
    // Fetch initial config - we can use server action or api. Since it's public we can create a simple GET api, but wait, config is public anyway. Let's create a GET endpoint.
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        setMessage("تم حفظ الإعدادات بنجاح");
      } else {
        setMessage("حدث خطأ أثناء الحفظ");
      }
    } catch (error) {
      setMessage("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">تخصيص تصميم صفحة التحقق</h1>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${message.includes('بنجاح') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-2xl">
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">عنوان الصفحة</label>
            <input
              type="text"
              name="pageTitle"
              value={config.pageTitle || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">رابط الشعار (URL)</label>
            <input
              type="text"
              name="logoUrl"
              value={config.logoUrl || ""}
              onChange={handleChange}
              dir="ltr"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-left"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100 space-y-4">
              <h3 className="font-bold text-green-800 border-b border-green-200 pb-2">إعدادات الهوية السارية</h3>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">لون الخلفية (Tailwind Classes)</label>
                <input
                  type="text"
                  name="validBgColor"
                  value={config.validBgColor || ""}
                  onChange={handleChange}
                  dir="ltr"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-left text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">الرسالة</label>
                <input
                  type="text"
                  name="validMessage"
                  value={config.validMessage || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-100 space-y-4">
              <h3 className="font-bold text-red-800 border-b border-red-200 pb-2">إعدادات الهوية المنتهية/غير الموجودة</h3>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">لون الخلفية (Tailwind Classes)</label>
                <input
                  type="text"
                  name="invalidBgColor"
                  value={config.invalidBgColor || ""}
                  onChange={handleChange}
                  dir="ltr"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-left text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">الرسالة</label>
                <input
                  type="text"
                  name="invalidMessage"
                  value={config.invalidMessage || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
