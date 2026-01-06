// components/upload/custom-upload-zone.tsx
'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadThing } from '@/lib/uploadthing/client';
import { toast } from 'sonner';
import { Upload, X, Loader2, Check } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import imageCompression from 'browser-image-compression';

interface UploadedFile {
  file: File;
  originalFile: File;
  preview: string;
  url?: string;
  progress: number;
  status: 'pending' | 'processing' | 'uploading' | 'completed' | 'error';
  originalSize: number;
}

interface CustomUploadZoneProps {
  onUploadComplete: (urls: string[]) => void;
  maxFiles?: number;
}

export function CustomUploadZone({ onUploadComplete, maxFiles = 5 }: CustomUploadZoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      if (res) {
        const uploadedUrls = res.map(r => r.url);
        onUploadComplete(uploadedUrls);
        
        setFiles(prev =>
          prev.map((file, idx) => ({
            ...file,
            url: uploadedUrls[idx],
            status: 'completed' as const,
            progress: 100,
          }))
        );
        
        toast.success(`${res.length} image${res.length > 1 ? 's' : ''} uploaded successfully!`);
      }
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
      setFiles(prev =>
        prev.map(file => ({
          ...file,
          status: 'error' as const,
        }))
      );
      setIsUploading(false);
    },
    onUploadProgress: (progress) => {
      setFiles(prev =>
        prev.map(file => ({
          ...file,
          progress: file.status === 'uploading' ? progress : file.progress,
        }))
      );
    },
  });

  const compressImage = async (file: File): Promise<File> => {
    const maxSizeMB = 3.5; // Target 3.5MB to stay safely under 4MB limit
    const fileSizeMB = file.size / 1024 / 1024;

    // If file is already small enough, return it
    if (fileSizeMB <= maxSizeMB) {
      return file;
    }

    try {
      const options = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type,
      };

      const compressedFile = await imageCompression(file, options);
      
      // If compression didn't work well enough, try more aggressive compression
      const compressedSizeMB = compressedFile.size / 1024 / 1024;
      if (compressedSizeMB > 4) {
        const aggressiveOptions = {
          maxSizeMB: 3,
          maxWidthOrHeight: 1600,
          useWebWorker: true,
          fileType: file.type,
        };
        return await imageCompression(file, aggressiveOptions);
      }

      return compressedFile;
    } catch (error) {
      console.error('Compression error:', error);
      // Silently return original file if compression fails
      return file;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Check for files that are too large (over 10MB before compression)
    const oversizedFiles = acceptedFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Some files are too large (max 10MB). Please choose smaller images.`);
      return;
    }

    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      originalFile: file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'processing' as const, // Show as processing while compressing
      originalSize: file.size,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Silently compress images in the background
    for (let i = 0; i < newFiles.length; i++) {
      const fileIndex = files.length + i;
      const file = newFiles[i];

      try {
        const compressedFile = await compressImage(file.originalFile);
        
        setFiles(prev =>
          prev.map((f, idx) =>
            idx === fileIndex
              ? {
                  ...f,
                  file: compressedFile,
                  status: 'pending' as const,
                }
              : f
          )
        );
      } catch (error) {
        // If compression fails, just use original file
        setFiles(prev =>
          prev.map((f, idx) =>
            idx === fileIndex
              ? { ...f, status: 'pending' as const }
              : f
          )
        );
      }
    }
  }, [files.length, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles,
    disabled: isUploading || files.length >= maxFiles,
  });

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    // Check if any files are still processing
    const stillProcessing = files.some(f => f.status === 'processing');
    if (stillProcessing) {
      toast.error('Please wait while we prepare your images');
      return;
    }

    // Check if any files are in error state
    const hasErrors = files.some(f => f.status === 'error');
    if (hasErrors) {
      toast.error('Please remove failed files before uploading');
      return;
    }

    setIsUploading(true);
    setFiles(prev =>
      prev.map(file => ({
        ...file,
        status: 'uploading' as const,
      }))
    );

    try {
      await startUpload(files.map(f => f.file));
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const allCompleted = files.length > 0 && files.every(f => f.status === 'completed');
  const isProcessing = files.some(f => f.status === 'processing');

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
            isDragActive
              ? "border-purple-500 bg-purple-50"
              : "border-purple-300 hover:border-purple-400 hover:bg-purple-50/50",
            (isUploading || files.length >= maxFiles) && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-purple-500" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            {isDragActive ? 'Drop your images here' : 'Drag & drop images here'}
          </p>
          <p className="text-sm text-gray-500">
            or click to browse ({files.length}/{maxFiles} uploaded)
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Supports: PNG, JPG, JPEG, GIF, WEBP (max 10MB)
          </p>
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative group bg-white rounded-lg overflow-hidden shadow-md border border-gray-200"
            >
              {/* Image Preview */}
              <div className="aspect-square relative bg-gray-100">
                <Image
                  src={file.preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                
                {/* Status Overlay */}
                {(file.status === 'processing' || file.status === 'uploading') && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                      {file.status === 'uploading' && (
                        <p className="text-sm font-medium">{file.progress}%</p>
                      )}
                    </div>
                  </div>
                )}

                {file.status === 'completed' && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <div className="bg-green-500 rounded-full p-2">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}

                {file.status === 'error' && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <p className="text-red-600 font-medium text-sm">Failed</p>
                  </div>
                )}
              </div>

              {/* Delete Button */}
              {file.status !== 'uploading' && file.status !== 'processing' && (
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* File Info */}
              <div className="p-2 bg-white border-t border-gray-200">
                <p className="text-xs text-gray-600 truncate" title={file.originalFile.name}>
                  {file.originalFile.name}
                </p>
                <p className="text-xs text-gray-400">
                  {(file.originalSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              {/* Progress Bar */}
              {file.status === 'uploading' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                  <div
                    className="h-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && !allCompleted && (
        <Button
          onClick={uploadFiles}
          disabled={isUploading || isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          size="lg"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Preparing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload {files.length} Image{files.length > 1 ? 's' : ''}
            </>
          )}
        </Button>
      )}

      {/* Success State */}
      {allCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700">
            <Check className="w-5 h-5" />
            <p className="font-medium">
              All images uploaded successfully! You can now fill in the details below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}