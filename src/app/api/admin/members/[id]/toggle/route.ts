import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { isValid, customMessage } = body;

    if (typeof isValid !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const updatedMember = await prisma.member.update({
      where: { id: params.id },
      data: { 
        isValid,
        customMessage: customMessage || null 
      },
    });

    return NextResponse.json({ success: true, isValid: updatedMember.isValid, customMessage: updatedMember.customMessage });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}
