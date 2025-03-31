import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = '/images/placeholder.svg' 
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  const handleError = () => {
    if (useFallback) {
      // If even the fallback fails, show error state
      setError(true);
      setLoading(false);
    } else {
      // Try the fallback image
      setUseFallback(true);
      setLoading(true);
    }
  };

  const handleLoad = () => {
    setLoading(false);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center bg-manuflix-dark p-4 text-center h-full w-full">
        <ImageOff className="text-manuflix-red mb-2" size={32} />
        <p className="text-sm text-manuflix-gray">Prévia não disponível</p>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-manuflix-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img 
        src={useFallback ? fallbackSrc : src} 
        alt={alt} 
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  );
};
