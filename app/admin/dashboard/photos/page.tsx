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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Trash2, Check, X } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  approved: boolean;
  uploadedAt: string;
}

export default function AdminPhotosPage() {
  const { data: session, isPending } = useSession();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      });

      if (response.ok) {
        toast.success(approved ? 'Photo approved!' : 'Photo unapproved');
        fetchImages();
      }
    } catch (error) {
      toast.error('Failed to update photo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(`/api/photos?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Photo deleted');
        fetchImages();
      }
    } catch (error) {
      toast.error('Failed to delete photo');
    }
  };

  if (isPending || isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin/dashboard">
                <ArrowLeft />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Manage Photos</h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Caption</TableHead>
                <TableHead>Guest Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>
                    <div className="relative w-20 h-20">
                      <Image
                        src={image.url}
                        alt={image.caption}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate">{image.caption}</p>
                  </TableCell>
                  <TableCell>
                    {image.guestName || 'Anonymous'}
                    {image.guestEmail && (
                      <p className="text-sm text-gray-500">{image.guestEmail}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={image.approved ? 'default' : 'secondary'}>
                      {image.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(image.uploadedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!image.approved && (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleApprove(image.id, true)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      {image.approved && (
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleApprove(image.id, false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(image.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {images.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No photos uploaded yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
