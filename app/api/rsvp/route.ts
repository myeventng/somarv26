import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { sendRSVPNotification } from '@/lib/email/nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, attending, guestCount, message } = body;

    // Save to database
    const rsvp = await prisma.rSVP.create({
      data: {
        name,
        email,
        attending,
        guestCount: attending ? guestCount : 0,
        message: message || null,
      },
    });

    // Send email notification
    try {
      await sendRSVPNotification({
        name,
        email,
        attending,
        guestCount: attending ? guestCount : 0,
        message,
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json({ success: true, data: rsvp });
  } catch (error) {
    console.error('RSVP Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit RSVP' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const rsvps = await prisma.rSVP.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: rsvps });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}
