'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

export function QRCodeGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uploadUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/upload` 
    : 'http://localhost:3000/upload';

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, uploadUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#6b21a8',
          light: '#ffffff',
        },
      });
    }
  }, [uploadUrl]);

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wedding-upload-qr.png';
      a.click();
    }
  };

  return (
    <div className="text-center">
      <canvas ref={canvasRef} />
      <Button onClick={downloadQRCode} className="mt-4" variant="outline">
        <Download className="w-4 h-4 mr-2" />
        Download QR Code
      </Button>
    </div>
  );
}
