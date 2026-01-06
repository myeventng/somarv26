// components/gallery/gallery-client.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Download, Loader2 } from 'lucide-react';
import type { GalleryImage } from '@/types/photo';

interface GalleryClientProps {
  initialImages: GalleryImage[];
  defaultImages: string[];
}

export function GalleryClient({ initialImages, defaultImages }: GalleryClientProps) {
  const [uploadedImages, setUploadedImages] = useState<GalleryImage[]>(initialImages);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialImages.length >= 12);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMoreImages = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/photos?skip=${uploadedImages.length}&take=12`
      );
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        setUploadedImages((prev) => [...prev, ...data.data]);
        setHasMore(data.data.length >= 12);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreImages();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, uploadedImages.length]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {uploadedImages.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square overflow-hidden rounded-lg shadow-lg group"
          >
            <Image
              src={image.url}
              alt={image.caption}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm line-clamp-2">{image.caption}</p>
              {image.guestName && (
                <p className="text-white/80 text-xs mt-1">By: {image.guestName}</p>
              )}
            </div>
            <a
              href={image.url}
              download
              className="absolute top-2 right-2 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Download className="w-5 h-5 text-primary" />
            </a>
          </div>
        ))}

        {defaultImages.map((image, index) => (
          <div
            key={`default-${index}`}
            className="relative aspect-square overflow-hidden rounded-lg shadow-lg group"
          >
            <Image
              src={image}
              alt={`Wedding photo ${index + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <a
              href={image}
              download
              className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Download className="w-5 h-5 text-primary" />
            </a>
          </div>
        ))}
      </div>

      {hasMore && (
        <div
          ref={observerTarget}
          className="flex justify-center items-center py-8"
        >
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading more photos...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && uploadedImages.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You&apos;ve reached the end of the gallery</p>
        </div>
      )}
    </>
  );
}