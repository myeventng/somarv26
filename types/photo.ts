//types/photo.ts
export interface GalleryImageUpload {
  url: string;
  caption: string;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
}

export interface GalleryImage extends GalleryImageUpload {
  id: string;
  uploadedAt: Date;
  updatedAt: Date;
}
