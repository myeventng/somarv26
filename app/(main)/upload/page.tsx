// app/upload/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CustomUploadZone } from '@/components/upload/custom-upload-zone';
import { toast } from 'sonner';
import { Send, ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function UploadPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    caption: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
  });
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadedUrls.length === 0) {
      toast.error('Please upload at least one image first');
      return;
    }

    if (!formData.caption.trim()) {
      toast.error('Please add a caption for your photos');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit each image with the same form data
      const promises = uploadedUrls.map(url =>
        fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            caption: formData.caption,
            guestName: formData.guestName || undefined,
            guestEmail: formData.guestEmail || undefined,
            guestPhone: formData.guestPhone || undefined,
          }),
        })
      );

      const results = await Promise.all(promises);
      const allSuccessful = results.every(r => r.ok);

      if (allSuccessful) {
        toast.success(
          `${uploadedUrls.length} photo${uploadedUrls.length > 1 ? 's' : ''} uploaded successfully! 🎉`,
          {
            description: 'Your photos are now live in the gallery!',
            duration: 5000,
          }
        );
        
        // Send email notification toast
        if (formData.guestEmail) {
          toast.success(`Confirmation email sent to ${formData.guestEmail}`, {
            duration: 4000,
          });
        }
        
        // Reset form
        setFormData({ caption: '', guestName: '', guestEmail: '', guestPhone: '' });
        setUploadedUrls([]);

        // Navigate to gallery immediately to see uploaded photos
        setTimeout(() => {
          router.push('/gallery');
        }, 1500);
      } else {
        toast.error('Some photos failed to upload. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('An error occurred while submitting your photos');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 md:py-20 bg-gradient-to-b from-purple-50 via-pink-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Share Your Photos
            </h1>
            <p className="text-lg text-gray-600">
              Upload your favorite moments from the wedding to our gallery
            </p>
          </div>

          {/* Instructions Alert */}
          <Alert className="mb-6 border-purple-200 bg-purple-50">
            <Info className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-gray-700">
              <strong className="font-semibold">How to upload:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                <li>First, upload your image(s) using the upload zone below</li>
                <li>Wait for the upload to complete (you&apos;ll see a green checkmark)</li>
                <li>Add a required caption describing your photo(s)</li>
                <li>Optionally, add your name and contact details</li>
                <li>Click &quot;Submit&quot; to publish your photos to the gallery instantly</li>
              </ol>
            </AlertDescription>
          </Alert>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 space-y-8">
            {/* Upload Zone */}
            <div className="space-y-2">
              <Label className="text-lg font-medium">
                Step 1: Upload Images *
              </Label>
              <p className="text-sm text-gray-500 mb-4">
                You can upload up to 5 images at once. Please wait for uploads to complete before proceeding.
              </p>
              <CustomUploadZone onUploadComplete={setUploadedUrls} maxFiles={5} />
            </div>

            {/* Caption Field */}
            <div className="space-y-2">
              <Label htmlFor="caption" className="text-lg font-medium">
                Step 2: Add Caption *
              </Label>
              <p className="text-sm text-gray-500 mb-2">
                Tell us about these beautiful moments
              </p>
              <Textarea
                id="caption"
                required
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="Share the story behind these beautiful moments..."
                rows={4}
                className="resize-none"
                disabled={uploadedUrls.length === 0}
              />
              {uploadedUrls.length === 0 && (
                <p className="text-xs text-amber-600">
                  ⚠️ Please upload image(s) first before adding caption
                </p>
              )}
            </div>

            {/* Optional Details */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">
                Step 3: Add Your Details (Optional)
              </Label>
              
              {/* Guest Name & Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="guestName" className="text-base font-medium">
                    Your Name
                  </Label>
                  <Input
                    id="guestName"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="John Doe"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestPhone" className="text-base font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="guestPhone"
                    type="tel"
                    value={formData.guestPhone}
                    onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                    placeholder="+234 800 000 0000"
                    className="h-11"
                  />
                </div>
              </div>

              {/* Guest Email */}
              <div className="space-y-2">
                <Label htmlFor="guestEmail" className="text-base font-medium">
                  Email Address
                </Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={formData.guestEmail}
                  onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                  placeholder="john@example.com"
                  className="h-11"
                />
                <p className="text-xs text-gray-500">
                  We&apos;ll send you a confirmation email when your photos are published
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isSubmitting || uploadedUrls.length === 0 || !formData.caption.trim()} 
              className="w-full h-12 text-base"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Publishing to Gallery...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {uploadedUrls.length > 0 
                    ? `Publish ${uploadedUrls.length} Photo${uploadedUrls.length > 1 ? 's' : ''} to Gallery`
                    : 'Publish to Gallery'
                  }
                </>
              )}
            </Button>

            {uploadedUrls.length === 0 && (
              <p className="text-center text-sm text-gray-500">
                📸 Upload at least one image to enable submission
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}