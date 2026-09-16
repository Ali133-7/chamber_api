import prisma from '@/lib/prisma';
import MemberStatusToggle from '@/components/MemberStatusToggle';
import QrThumbnail from '@/components/QrThumbnail';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  const members = await prisma.member.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
        { memberNumber: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { syncedAt: 'desc' },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">قائمة التجار المزامنين</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <form className="flex items-center">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="ابحث بالاسم، الصنف، أو رقم العضوية..."
              className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="mr-3 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
            >
              بحث
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold">الاسم</th>
                <th className="p-4 font-semibold">رقم العضوية</th>
                <th className="p-4 font-semibold">الصنف</th>
                <th className="p-4 font-semibold text-center">الحالة (تفعيل/إلغاء)</th>
                <th className="p-4 font-semibold">آخر مزامنة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    لا يوجد تجار لعرضهم
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        <QrThumbnail token={member.token} memberName={member.name} />
                        <span>{member.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{member.memberNumber}</td>
                    <td className="p-4 text-gray-600">{member.category}</td>
                    <td className="p-4 align-middle">
                      <MemberStatusToggle member={member} />
                    </td>
                    <td className="p-4 text-gray-500" dir="ltr">
                      {new Date(member.syncedAt).toLocaleString('en-US')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
