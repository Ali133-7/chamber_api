"use client";

import { useState } from "react";
import { isMemberExpired } from "@/lib/expiration";

interface MemberStatusToggleProps {
  member: {
    id: string;
    isValid: boolean;
    memberNumber: string;
    createdAt: Date;
  };
}

export default function MemberStatusToggle({ member }: MemberStatusToggleProps) {
  const [isValid, setIsValid] = useState(member.isValid);
  const [loading, setLoading] = useState(false);

  const expired = isMemberExpired(member.memberNumber, new Date(member.createdAt));
  const effectivelyValid = isValid && !expired;

  const handleToggle = async () => {
    setLoading(true);
    const newValue = !isValid;
    // Optimistic update
    setIsValid(newValue);

    try {
      const res = await fetch(`/api/admin/members/${member.id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isValid: newValue }),
      });

      if (!res.ok) {
        // Revert on failure
        setIsValid(isValid);
        alert("فشل في تحديث حالة التاجر.");
      }
    } catch (error) {
      setIsValid(isValid);
      alert("حدث خطأ أثناء الاتصال.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          isValid ? "bg-green-500" : "bg-gray-300"
        } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isValid ? "-translate-x-6" : "-translate-x-1"
          }`}
        />
      </button>
      
      {/* Status Label */}
      <div className="text-xs font-bold mt-1 text-center">
        {expired ? (
          <span className="text-orange-600 bg-orange-100 px-2 py-0.5 rounded">منتهية زمنياً</span>
        ) : effectivelyValid ? (
          <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded">سارية</span>
        ) : (
          <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded">ملغاة</span>
        )}
      </div>
    </div>
  );
}
