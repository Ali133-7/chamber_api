"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  const [config, setConfig] = useState({
    pageTitle: "",
    logoUrl: "",
    validBgStart: "",
    validBgEnd: "",
    invalidBgStart: "",
    invalidBgEnd: "",
    validMessage: "",
    invalidMessage: "",
    primaryColor: "",
    dangerColor: "",
  });

  useEffect(() => {
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

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
        
        <div className="space-y-8">
          {/* General Settings */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-700 border-b pb-2">الإعدادات العامة</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">عنوان الصفحة (يظهر في الأعلى)</label>
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
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Valid State Settings */}
            <div className="p-5 bg-green-50 rounded-xl border border-green-200 space-y-5 shadow-sm">
              <h3 className="text-lg font-bold text-green-800 border-b border-green-200 pb-2">الهوية السارية (اللون الأخضر)</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">الرسالة الترحيبية</label>
                <input
                  type="text"
                  name="validMessage"
                  value={config.validMessage || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">لون الخلفية (العلوي)</label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="color"
                      name="validBgStart"
                      value={config.validBgStart || "#dcfce7"}
                      onChange={handleChange}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs text-gray-500 font-mono" dir="ltr">{config.validBgStart}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">لون الخلفية (السفلي)</label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="color"
                      name="validBgEnd"
                      value={config.validBgEnd || "#eff6ff"}
                      onChange={handleChange}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs text-gray-500 font-mono" dir="ltr">{config.validBgEnd}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">لون النصوص المميزة (الأيقونات ورسالة التأكيد)</label>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="color"
                    name="primaryColor"
                    value={config.primaryColor || "#15803d"}
                    onChange={handleChange}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-xs text-gray-500 font-mono" dir="ltr">{config.primaryColor}</span>
                </div>
              </div>
            </div>

            {/* Invalid State Settings */}
            <div className="p-5 bg-red-50 rounded-xl border border-red-200 space-y-5 shadow-sm">
              <h3 className="text-lg font-bold text-red-800 border-b border-red-200 pb-2">الهوية المنتهية/المفقودة (اللون الأحمر)</h3>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">رسالة التنبيه</label>
                <input
                  type="text"
                  name="invalidMessage"
                  value={config.invalidMessage || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">لون الخلفية (العلوي)</label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="color"
                      name="invalidBgStart"
                      value={config.invalidBgStart || "#fee2e2"}
                      onChange={handleChange}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs text-gray-500 font-mono" dir="ltr">{config.invalidBgStart}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">لون الخلفية (السفلي)</label>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <input
                      type="color"
                      name="invalidBgEnd"
                      value={config.invalidBgEnd || "#fef2f2"}
                      onChange={handleChange}
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs text-gray-500 font-mono" dir="ltr">{config.invalidBgEnd}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">لون نص التنبيه</label>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="color"
                    name="dangerColor"
                    value={config.dangerColor || "#b91c1c"}
                    onChange={handleChange}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-xs text-gray-500 font-mono" dir="ltr">{config.dangerColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition w-full md:w-auto text-lg shadow-md"
            >
              {saving ? "جاري الحفظ..." : "حفظ الإعدادات بنجاح"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
