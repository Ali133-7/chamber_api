"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, Users, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row rtl font-sans" dir="rtl">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-l border-gray-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">لوحة الإدارة</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 text-gray-700">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="font-medium">التجار</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-50 text-gray-700">
            <Settings className="w-5 h-5 text-gray-500" />
            <span className="font-medium">تخصيص التصميم</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center space-x-3 space-x-reverse p-3 w-full rounded-lg hover:bg-red-50 text-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
