// app/(main)/gallery/page.tsx
import { GalleryClient } from '@/components/gallery/gallery-client';
import { prisma } from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { GalleryImage } from '@/types/photo';
import { Heart, Upload } from 'lucide-react';

async function getInitialGalleryImages(): Promise<GalleryImage[]> {
  const images = await prisma.galleryImage.findMany({
    orderBy: { uploadedAt: 'desc' },
    take: 12, 
  });
  return images;
}

// Force dynamic rendering to always show latest photos
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GalleryPage() {
  const initialImages = await getInitialGalleryImages();

  const defaultImages = [
    '/assets/images/couple-image.png',
    '/assets/images/couple-image-portait.png',
    '/assets/images/couple-in-wedding-cloth-and-drinking-wine.png',
    '/assets/images/couple-in-wedding-cloth-another-position.png',
    '/assets/images/couple-in-wedding-clothes.png',
    '/assets/images/couple-in-wedding-clothe-sitting.png',
    '/assets/images/couple-in-wedding-gown3.png',
    '/assets/images/couple-in-wedding-gown-looking-eye-to-eye.png',
    '/assets/images/couple-pouring-dring.png',
    '/assets/images/tennis-cloth.png',
    '/assets/images/tennis-clothing2.png',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-400 rounded-full blur-3xl" />
      </div>

      {/* Floating Hearts */}
      <div className="absolute top-20 right-20 opacity-10">
        <Heart className="w-24 h-24 text-purple-600 animate-float" fill="currentColor" />
      </div>
      <div className="absolute bottom-40 left-10 opacity-10">
        <Heart className="w-32 h-32 text-pink-600 animate-float-slow" fill="currentColor" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-purple-400 to-purple-600" />
            <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent via-purple-400 to-purple-600" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-cormorant font-bold mb-4 text-purple-700">
            Our Gallery
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 font-montserrat max-w-2xl mx-auto">
            Every moment, every smile, every memory—captured forever in time
          </p>

          {/* Photo Count and Upload Button Container */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border-2 border-purple-200">
              <p className="text-purple-700 font-cormorant text-lg">
                <span className="font-bold">{initialImages.length + defaultImages.length}</span> beautiful moments and counting...
              </p>
            </div>

            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/upload" className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Share Your Photos
              </Link>
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        <GalleryClient 
          initialImages={initialImages} 
          defaultImages={defaultImages} 
        />
      </div>
    </div>
  );
}