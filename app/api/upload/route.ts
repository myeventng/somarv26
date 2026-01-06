// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { sendUploadNotification } from '@/lib/email/nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, caption, guestName, guestEmail, guestPhone } = body;

    const image = await prisma.galleryImage.create({
      data: {
        url,
        caption,
        guestName: guestName || null,
        guestEmail: guestEmail || null,
        guestPhone: guestPhone || null,
      },
    });

    // Send email notification
    try {
      await sendUploadNotification({
        caption,
        guestName,
        guestEmail,
        guestPhone,
        imageUrl: url,
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}