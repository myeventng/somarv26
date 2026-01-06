// app/api/photos/count/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const count = await prisma.galleryImage.count();
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('Count Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to count images' },
      { status: 500 }
    );
  }
}