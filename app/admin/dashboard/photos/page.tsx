// app/admin/dashboard/photos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { useSession } from '@/lib/auth/auth-client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Trash2, Eye } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  uploadedAt: string;
}

export default function AdminPhotosPage() {
  const { data: session, isPending } = useSession();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      redirect('/admin/login');
    }
  }, [session, isPending]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/photos');
      const data = await response.json();
      if (data.success) {
        setImages(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/photos?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Photo deleted successfully');
        fetchImages();
      } else {
        toast.error('Failed to delete photo');
      }
    } catch (error) {
      toast.error('An error occurred while deleting');
    }
  };

  const handleViewImage = (url: string) => {
    window.open(url, '_blank');
  };

  const formatDate = (dateString: string) => {
    if (!isMounted) return ''; // Prevent hydration mismatch
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    if (!isMounted) return ''; // Prevent hydration mismatch
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Gallery Photos</h1>
              <p className="text-gray-600 mt-1">
                {images.length} {images.length === 1 ? 'photo' : 'photos'} in gallery
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {images.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-24">Image</TableHead>
                  <TableHead>Caption</TableHead>
                  <TableHead>Guest Info</TableHead>
                  <TableHead>Date Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((image) => (
                  <TableRow key={image.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={image.url}
                          alt={image.caption}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="line-clamp-2 text-sm">{image.caption}</p>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{image.guestName || 'Anonymous'}</p>
                        {image.guestEmail && (
                          <p className="text-gray-500 text-xs">{image.guestEmail}</p>
                        )}
                        {image.guestPhone && (
                          <p className="text-gray-500 text-xs">{image.guestPhone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">
                          {formatDate(image.uploadedAt)}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {formatTime(image.uploadedAt)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleViewImage(image.url)}
                          title="View full image"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDelete(image.id)}
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos yet</h3>
              <p className="text-gray-500 mb-6">
                Guest-uploaded photos will appear here automatically
              </p>
              <Button asChild variant="outline">
                <Link href="/upload">Go to Upload Page</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}