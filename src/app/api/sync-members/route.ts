import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (token !== process.env.SYNC_API_KEY) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const records = body.records;

    if (!records || !Array.isArray(records)) {
      return NextResponse.json({ error: 'Invalid payload: records array is required' }, { status: 400 });
    }

    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const record of records) {
      try {
        const {
          token,
          member_number,
          name,
          entity_type,
          trade_name,
          category,
          status,
          is_valid,
          company,
          qr_visible
        } = record;

        if (!token) {
          failed++;
          continue;
        }

        const existingMember = await prisma.member.findUnique({
          where: { token }
        });

        if (existingMember) {
          await prisma.member.update({
            where: { token },
            data: {
              memberNumber: String(member_number),
              name: String(name),
              entityType: String(entity_type),
              tradeName: String(trade_name),
              category: String(category),
              status: String(status),
              isValid: Boolean(is_valid),
              company: company ? String(company) : null,
              qrVisible: Boolean(qr_visible),
              syncedAt: new Date()
            }
          });
          updated++;
        } else {
          await prisma.member.create({
            data: {
              token: String(token),
              memberNumber: String(member_number),
              name: String(name),
              entityType: String(entity_type),
              tradeName: String(trade_name),
              category: String(category),
              status: String(status),
              isValid: Boolean(is_valid),
              company: company ? String(company) : null,
              qrVisible: Boolean(qr_visible),
              syncedAt: new Date()
            }
          });
          created++;
        }
      } catch (error) {
        console.error('Error syncing record:', error);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sync completed',
      stats: { created, updated, failed }
    });

  } catch (error) {
    console.error('Sync API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
