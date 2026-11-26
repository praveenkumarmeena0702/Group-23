import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeSvgProps {
  value: string;
  size?: number;
  className?: string;
}

export function QrCodeSvg({ value, size = 148, className = '' }: QrCodeSvgProps) {
  const [svgMarkup, setSvgMarkup] = useState<string>('');

  useEffect(() => {
    let active = true;
    QRCode.toString(value, {
      type: 'svg',
      margin: 1,
      width: size,
      color: {
        dark: '#171717',
        light: '#FFFFFF',
      },
    })
      .then((svg) => {
        if (active) setSvgMarkup(svg);
      })
      .catch(() => {
        if (active) setSvgMarkup('');
      });

    return () => {
      active = false;
    };
  }, [value, size]);

  if (!svgMarkup) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`animate-pulse rounded-[16px] bg-[#F5F7FA] ${className}`}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`overflow-hidden rounded-[16px] border border-[#E9EDF2] bg-white p-2 ${className}`}
      aria-label={`QR code for ${value}`}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
}
