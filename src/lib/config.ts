import prisma from '@/lib/prisma';

export const defaultConfig = {
  pageTitle: 'نظام التحقق من الهويات — غرفة تجارة صلاح الدين',
  validBgColor: 'bg-gradient-to-br from-green-100 to-blue-50',
  invalidBgColor: 'bg-gradient-to-br from-red-100 to-red-50',
  logoUrl: 'https://via.placeholder.com/150', // Replace with real logo
  validMessage: 'معلومات الهوية الظاهرة أمامك صحيحة ✓',
  invalidMessage: '⚠ هذه الهوية غير سارية أو غير معروفة لدى الغرفة',
  primaryColor: 'text-green-700',
  dangerColor: 'text-red-700',
};

export async function getSiteConfig() {
  try {
    const configs = await prisma.siteConfig.findMany();
    const configMap = configs.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return { ...defaultConfig, ...configMap };
  } catch (error) {
    return defaultConfig;
  }
}
