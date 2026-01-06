// app/admin/dashboard/photos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Trash2, Eye, Upload, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  uploadedAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminPhotosPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/admin/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      fetchImages();
    }
  }, [session, currentPage]);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const skip = (currentPage - 1) * ITEMS_PER_PAGE;
      const response = await fetch(`/api/photos?skip=${skip}&take=${ITEMS_PER_PAGE}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error('Failed to fetch photos');
      }

      setImages(data.data);
      
      // Get total count
      const countResponse = await fetch('/api/photos/count');
      const countData = await countResponse.json();
      if (countData.success) {
        setTotalImages(countData.count);
      }
    } catch (error) {
      toast.error('Failed to fetch photos');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setImageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;

    try {
      const response = await fetch(`/api/photos?id=${imageToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete photo');

      toast.success('Photo deleted successfully');
      fetchImages();
    } catch (error) {
      toast.error('Failed to delete photo');
      console.error('Delete error:', error);
    } finally {
      setDeleteDialogOpen(false);
      setImageToDelete(null);
    }
  };

  const handleViewImage = (url: string) => {
    window.open(url, '_blank');
  };

  const formatDate = (dateString: string) => {
    if (!isMounted) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    if (!isMounted) return '';
    
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPages = Math.ceil(totalImages / ITEMS_PER_PAGE);

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

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Gallery Photos</h1>
              <p className="text-gray-600 mt-1">
                {totalImages} {totalImages === 1 ? 'photo' : 'photos'} in gallery
              </p>
            </div>
          </div>

          {/* Upload Button */}
          <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full sm:w-auto">
            <Link href="/upload" className="flex items-center gap-2 justify-center">
              <Upload className="w-4 h-4" />
              Upload Photos
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {images.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-24">Image</TableHead>
                      <TableHead>Caption</TableHead>
                      <TableHead>Guest Info</TableHead>
                      <TableHead>Date Uploaded</TableHead>
                      <TableHead className="text-right min-w-[120px]">Actions</TableHead>
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
                        <TableCell className="min-w-[120px] whitespace-nowrap">
                          <div className="flex gap-2 justify-end items-center">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleViewImage(image.url)}
                              title="View full image"
                              className="h-9 w-9 flex-shrink-0"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDeleteClick(image.id)}
                              title="Delete photo"
                              className="h-9 w-9 bg-red-600 hover:bg-red-700 text-white flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {images.map((image) => (
                  <div key={image.id} className="p-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={image.url}
                          alt={image.caption}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2 mb-1">{image.caption}</p>
                        <p className="text-xs text-gray-600">{image.guestName || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{formatDate(image.uploadedAt)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewImage(image.url)}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(image.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Previous</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <span className="hidden sm:inline mr-1">Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
                <Upload className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos yet</h3>
              <p className="text-gray-500 mb-6">
                Upload photos from the wedding to share with guests
              </p>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link href="/upload" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Your First Photo
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the photo
              from the gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}