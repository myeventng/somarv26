'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageModal } from './image-modal';

interface ImageGridProps {
  images: Array<{
    id: string;
    url: string;
    caption: string;
    guestName?: string;
  }>;
}

export function ImageGrid({ images }: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCaption, setSelectedCaption] = useState<string>('');

  const handleImageClick = (url: string, caption: string) => {
    setSelectedImage(url);
    setSelectedCaption(caption);
  };

  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((image) => (
          <div
            key={image.id}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
            onClick={() => handleImageClick(image.url, image.caption)}
          >
            <div className="relative w-full">
              <Image
                src={image.url}
                alt={image.caption}
                width={400}
                height={600}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium">{image.caption}</p>
                  {image.guestName && (
                    <p className="text-white/80 text-xs mt-1">By: {image.guestName}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          caption={selectedCaption}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}
