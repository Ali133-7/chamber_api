import prisma from '@/lib/prisma';

export const defaultConfig = {
  pageTitle: 'نظام التحقق من الهويات — غرفة تجارة صلاح الدين',
  validBgStart: '#dcfce7',
  validBgEnd: '#eff6ff',
  invalidBgStart: '#fee2e2',
  invalidBgEnd: '#fef2f2',
  logoUrl: 'https://via.placeholder.com/150', // Replace with real logo
  validMessage: 'معلومات الهوية الظاهرة أمامك صحيحة ✓',
  invalidMessage: '⚠ هذه الهوية غير سارية أو غير معروفة لدى الغرفة',
  primaryColor: '#15803d',
  dangerColor: '#b91c1c',
  contactPhone: '',
  contactEmail: '',
  mapUrl: '',
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
