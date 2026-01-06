// app/api/photos/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/session';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    
    // Await the params Promise
    const { id } = await context.params;
    
    const body = await request.json();
    const { caption, approved } = body;

    const image = await prisma.galleryImage.update({
      where: { id },
      data: {
        ...(caption !== undefined && { caption }),
        ...(approved !== undefined && { approved }),
      },
    });

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error('Update image error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    
    // Await the params Promise
    const { id } = await context.params;

    await prisma.galleryImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}