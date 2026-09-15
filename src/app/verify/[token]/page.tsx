import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSiteConfig } from '@/lib/config';
import { CheckCircle, XCircle, Building2, User, Tag } from 'lucide-react';
import Image from 'next/image';

interface PageProps {
  params: {
    token: string;
  };
}

export default async function VerifyPage({ params }: PageProps) {
  const { token } = params;
  const config = await getSiteConfig();

  // Find member
  const member = await prisma.member.findUnique({
    where: { token },
  });

  const isValid = member?.isValid && member?.qrVisible;

  // Determine styles based on validity
  const bgClass = isValid ? config.validBgColor : config.invalidBgColor;
  const messageColor = isValid ? config.primaryColor : config.dangerColor;
  const message = isValid ? config.validMessage : config.invalidMessage;

  return (
    <div className={`min-h-screen ${bgClass} flex flex-col items-center py-12 px-4 rtl font-sans`} dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        {config.logoUrl && config.logoUrl !== '' && (
          <div className="relative w-24 h-24 mb-4">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={config.logoUrl} 
              alt="شعار الغرفة" 
              className="object-contain w-full h-full"
            />
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {config.pageTitle}
        </h1>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Status Banner */}
        <div className={`flex items-center justify-center p-4 ${isValid ? 'bg-green-50' : 'bg-red-50'} border-b ${isValid ? 'border-green-100' : 'border-red-100'}`}>
          {isValid ? (
            <CheckCircle className={`w-6 h-6 ml-2 ${messageColor}`} />
          ) : (
            <XCircle className={`w-6 h-6 ml-2 ${messageColor}`} />
          )}
          <span className={`text-lg font-bold ${messageColor}`}>
            {message}
          </span>
        </div>

        {/* Member Details */}
        {isValid && member && (
          <div className="p-6 space-y-4">
            
            <div className="flex items-start">
              <User className="w-5 h-5 ml-3 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">اسم التاجر</p>
                <p className="text-lg font-semibold text-gray-900">{member.name}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Building2 className="w-5 h-5 ml-3 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">نوع الكيان</p>
                <p className="text-lg font-semibold text-gray-900">{member.entityType}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Tag className="w-5 h-5 ml-3 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">صنف العضوية</p>
                <p className="text-lg font-semibold text-gray-900">{member.category}</p>
              </div>
            </div>

          </div>
        )}

        {/* Footer info if invalid */}
        {!isValid && (
          <div className="p-6 text-center text-gray-600">
            <p>الرجاء مراجعة غرفة تجارة صلاح الدين لتحديث أو تصحيح بياناتك.</p>
          </div>
        )}

      </div>
      
      {/* Footer */}
      <div className="mt-8 text-sm text-gray-500 text-center">
        جميع الحقوق محفوظة © {new Date().getFullYear()} - غرفة تجارة صلاح الدين
      </div>

    </div>
  );
}
