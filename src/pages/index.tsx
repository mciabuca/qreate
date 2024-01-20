import React, { useState } from 'react';
import QRCode, { QRCodeToDataURLOptions } from 'qrcode';
import Image from 'next/image';

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";



const Home = () => {
  const [url, setUrl] = useState('');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState('M');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateQR();
  };

  const handleDownload = (format: 'png' | 'svg') => {
    if (qrCodeUrl) {
      downloadImage(format);
    }
  };

  const generateQR = async () => {
    try {
      const options: QRCodeToDataURLOptions = {
        errorCorrectionLevel: 'H',
        scale: 10,
      };
      const qrImageUrl = await QRCode.toDataURL(url, options);
      if (typeof qrImageUrl === 'string') {
        setQrCodeUrl(qrImageUrl);
      } else {
        console.error('QRCode.toDataURL did not return a string');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadImage = (format: 'png' | 'svg') => {
    if (format === 'png' && qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `qrcode.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadSVG = async () => {
    try {
      const svgString = await QRCode.toString(url, { type: 'svg', errorCorrectionLevel: 'H' });
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = svgUrl;
      link.download = 'qrcode.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(svgUrl);
    } catch (error) {
      console.error('Error generating QR code SVG:', error);
    }
  };

  return (
    <div className="grid w-full max-w-2xl gap-6 p-4 mx-auto">
      <div className="flex justify-end">
        <ModeToggle />
      </div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>QReate</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <Label htmlFor="data">Data / URL</Label>
              <Input id="data" placeholder="Enter data or URL" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
          </form>
          {qrCodeUrl && (
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-lg font-semibold">QR Code Preview</h2>
                <div className="w-64 h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <Image alt="QR Code" src={qrCodeUrl} width={500} height={500} className="aspect-square object-contain" />
                </div>
                <div className="flex justify-center gap-4">
                  <Button type="button" onClick={() => handleDownload('png')}>Download PNG</Button>
                  <Button type="button" onClick={downloadSVG}>Download SVG</Button>
                </div>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;