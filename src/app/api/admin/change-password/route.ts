import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: 'غير مصرح لك بالقيام بهذا الإجراء' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'الرجاء إدخال جميع الحقول' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'كلمة المرور الجديدة يجب أن تتكون من 6 أحرف على الأقل' }, { status: 400 });
    }

    // Get the admin user from DB
    const admin = await prisma.adminUser.findUnique({
      where: { email: session.user.email },
    });

    if (!admin) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
    }

    // Hash the new password and update
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.adminUser.update({
      where: { email: session.user.email },
      data: { passwordHash: newPasswordHash },
    });

    return NextResponse.json({ message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (error) {
    console.error('Change Password Error:', error);
    return NextResponse.json({ error: 'حدث خطأ غير متوقع أثناء تغيير كلمة المرور' }, { status: 500 });
  }
}
