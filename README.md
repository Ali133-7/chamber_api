# نظام التحقق من الهويات - غرفة تجارة صلاح الدين

هذا المشروع عبارة عن نظام متكامل للتحقق من هويات التجار عبر مسح رمز QR وتوجيه المستخدمين إلى صفحة عامة للتحقق من صحة معلومات التاجر وصلاحية هويته. 

## التقنيات المستخدمة
- **Next.js 14** (App Router)
- **React**
- **Tailwind CSS**
- **Prisma ORM**
- **PostgreSQL** (مُستضاف على Neon)
- **NextAuth.js** (لتسجيل دخول الإدارة)

## إعداد قاعدة بيانات Neon
1. قم بإنشاء حساب ومشروع جديد في [Neon.tech](https://neon.tech/).
2. انسخ رابط الاتصال بقاعدة البيانات (Connection String) الذي يبدو هكذا: `postgresql://user:password@...`.
3. ألصق الرابط في ملف `.env` الخاص بك تحت المتغير `DATABASE_URL`.

## التشغيل المحلي (Local Development)
1. انسخ ملف `.env.example` إلى `.env`:
   ```bash
   cp .env.example .env
   ```
2. قم بتعبئة المتغيرات في ملف `.env`.
3. ثبّت الحزم المطلوبة:
   ```bash
   npm install
   ```
4. قم بإنشاء جداول قاعدة البيانات:
   ```bash
   npx prisma db push
   # أو
   npx prisma migrate dev --name init
   ```
5. إنشاء مستخدم الإدارة الافتراضي (اختياري، يمكنك تغيير البريد وكلمة المرور من `.env`):
   ```bash
   node scripts/seed-admin.js
   ```
6. قم بتشغيل خادم التطوير:
   ```bash
   npm run dev
   ```

## النشر على Vercel (Deployment)
عند النشر على Vercel، يجب إضافة المتغيرات البيئية (Environment Variables) التالية في إعدادات المشروع:
- `DATABASE_URL`: رابط الاتصال بقاعدة بيانات Neon.
- `SYNC_API_KEY`: مفتاح سري قوي يستخدم لمصادقة طلبات المزامنة القادمة من Odoo.
- `NEXTAUTH_SECRET`: مفتاح سري عشوائي لتشفير الجلسات (يمكنك توليده عبر `openssl rand -base64 32`).
- `NEXTAUTH_URL`: الرابط الأساسي للموقع (مثل `https://your-domain.vercel.app`).

**ملاحظة:** عند النشر، سيقوم Vercel تلقائياً بتشغيل `prisma generate` كجزء من عملية البناء.

## مزامنة البيانات من Odoo (نقطة API)
يجب على نظام Odoo إرسال طلب `POST` يومياً إلى الرابط:
`https://your-domain.vercel.app/api/sync-members`

**ترويسات الطلب (Headers):**
```
Authorization: Bearer <SYNC_API_KEY>
Content-Type: application/json
```

**شكل جسم الطلب (Body JSON):**
```json
{
  "records": [
    {
      "token": "a1b2c3d4e5f6g7h8",
      "member_number": "12345",
      "name": "أحمد محمد",
      "entity_type": "فرد",
      "trade_name": "شركة الأمل",
      "category": "الدرجة الأولى",
      "status": "نشط",
      "is_valid": true,
      "company": "شركة الأمل للتجارة",
      "qr_visible": true
    }
  ]
}
```
سيقوم النظام بتحديث السجل إذا كان الرمز `token` موجوداً، أو سيقوم بإنشائه إذا لم يكن موجوداً.
