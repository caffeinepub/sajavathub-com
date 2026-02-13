import { useState, useEffect } from 'react';

interface SafeExternalImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export default function SafeExternalImage({
  src,
  alt,
  className = '',
  fallbackSrc = '/assets/generated/portfolio-1.dim_1200x800.png',
}: SafeExternalImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);

  // Reset state when src prop changes (e.g., navigation to different product)
  useEffect(() => {
    setImgSrc(src);
    setHasErrored(false);
  }, [src]);

  const handleError = () => {
    if (!hasErrored) {
      setHasErrored(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
