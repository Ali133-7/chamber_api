import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getSiteConfig } from '@/lib/config';
import { CheckCircle, XCircle, Building2, User, Tag, Phone, Mail, MapPin } from 'lucide-react';
import { isMemberEffectivelyValid } from '@/lib/expiration';

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
      <div className="w-full max-w-lg mt-8 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 text-center">
        <h3 className="text-lg font-bold text-gray-700 mb-4">للتواصل والمراجعة</h3>
        <div className="flex flex-wrap justify-center gap-4">
          
          {config.contactPhone && (
            <a href={`tel:${config.contactPhone}`} className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 text-gray-800 hover:bg-gray-50 hover:shadow-md transition-all font-bold">
              <Phone className="w-5 h-5 text-blue-600" />
              <span dir="ltr">{config.contactPhone}</span>
            </a>
          )}
          
          {config.contactEmail && (
            <a href={`mailto:${config.contactEmail}`} className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 text-gray-800 hover:bg-gray-50 hover:shadow-md transition-all font-bold">
              <Mail className="w-5 h-5 text-blue-600" />
              <span>البريد الإلكتروني</span>
            </a>
          )}
          
          {config.mapUrl && (
            <a href={config.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-200 text-gray-800 hover:bg-gray-50 hover:shadow-md transition-all font-bold">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>موقع الغرفة</span>
            </a>
          )}

          {(!config.contactPhone && !config.contactEmail && !config.mapUrl) && (
            <p className="text-gray-500 text-sm">الرجاء مراجعة مقر الغرفة الرئيسي.</p>
          )}

        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-sm text-gray-600 text-center font-bold drop-shadow-sm bg-white/50 px-6 py-2 rounded-full">
        جميع الحقوق محفوظة © {new Date().getFullYear()} - غرفة تجارة صلاح الدين
      </div>

    </div>
  );
}
