'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import { DownloadButton } from './download-button';

interface ImageModalProps {
  imageUrl: string;
  caption: string;
  onClose: () => void;
}

export function ImageModal({ imageUrl, caption, onClose }: ImageModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <div className="relative w-full h-[70vh]">
          <Image
            src={imageUrl}
            alt={caption}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">{caption}</p>
          <DownloadButton imageUrl={imageUrl} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
