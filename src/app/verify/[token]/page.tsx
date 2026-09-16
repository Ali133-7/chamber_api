import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSiteConfig } from '@/lib/config';
import { CheckCircle, XCircle, Building2, User, Tag } from 'lucide-react';
import { isMemberEffectivelyValid } from '@/lib/expiration';
import ContactAccordion from '@/components/ContactAccordion';

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

  const isValid = member ? (isMemberEffectivelyValid(member) && member.qrVisible) : false;

  // Determine styles based on validity
  const bgStart = isValid ? config.validBgStart : config.invalidBgStart;
  const bgEnd = isValid ? config.validBgEnd : config.invalidBgEnd;
  const textColor = isValid ? config.primaryColor : config.dangerColor;
  
  let message = isValid ? config.validMessage : config.invalidMessage;
  if (member && member.customMessage && member.customMessage.trim() !== "") {
    message = member.customMessage;
  }

  const bgStyle = {
    background: `linear-gradient(to bottom right, ${bgStart}, ${bgEnd})`
  };

  return (
    <div className={`min-h-screen flex flex-col items-center py-12 px-4 rtl font-sans`} dir="rtl" style={bgStyle}>
      
      {/* Header */}
      <div className="flex flex-col items-center mb-10 text-center space-y-4">
        {config.logoUrl && config.logoUrl !== '' && (
          <div className="relative w-32 h-32 bg-white rounded-2xl shadow-md p-2">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={config.logoUrl} 
              alt="شعار الغرفة" 
              className="object-contain w-full h-full"
            />
          </div>
        )}
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800 drop-shadow-sm tracking-tight">
          {config.pageTitle}
        </h1>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Status Banner */}
        <div className={`flex flex-col items-center justify-center p-8 text-center`} style={{ backgroundColor: bgStart, borderBottom: `2px solid ${bgEnd}` }}>
          {isValid ? (
            <CheckCircle className={`w-16 h-16 mb-4 drop-shadow-md`} style={{ color: textColor }} />
          ) : (
            <XCircle className={`w-16 h-16 mb-4 drop-shadow-md`} style={{ color: textColor }} />
          )}
          <span className={`text-2xl font-black tracking-wide`} style={{ color: textColor }}>
            {message}
          </span>
        </div>

        {/* Member Details */}
        {member && (
          <div className="p-8 space-y-6">
            
            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <User className="w-6 h-6 text-gray-500" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-semibold text-gray-400 mb-1">اسم التاجر</p>
                <p className="text-xl font-bold text-gray-900">{member.name}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <Building2 className="w-6 h-6 text-gray-500" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-semibold text-gray-400 mb-1">نوع الكيان</p>
                <p className="text-xl font-bold text-gray-900">{member.entityType}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <Tag className="w-6 h-6 text-gray-500" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-semibold text-gray-400 mb-1">صنف العضوية</p>
                <p className="text-xl font-bold text-gray-900">{member.category}</p>
              </div>
            </div>

          </div>
        )}

        {!member && (
          <div className="p-8 text-center text-gray-600 font-medium text-lg">
            عذراً، لم يتم العثور على أي هوية مطابقة لهذا الرمز.
          </div>
        )}

      </div>

      {/* Contact Section */}
      <ContactAccordion 
        phone={config.contactPhone || ""} 
        email={config.contactEmail || ""} 
        mapUrl={config.mapUrl || ""} 
      />
      
      {/* Footer */}
      <div className="mt-8 text-sm text-gray-600 text-center font-bold drop-shadow-sm bg-white/50 px-6 py-2 rounded-full">
        جميع الحقوق محفوظة © {new Date().getFullYear()} - غرفة تجارة صلاح الدين
      </div>

    </div>
  );
}
