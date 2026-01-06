import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/session';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    
    const body = await request.json();
    const { caption, approved } = body;

    const image = await prisma.galleryImage.update({
      where: { id: params.id },
      data: {
        ...(caption !== undefined && { caption }),
        ...(approved !== undefined && { approved }),
      },
    });

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update image' },
      { status: 500 }
    );
  }
}
