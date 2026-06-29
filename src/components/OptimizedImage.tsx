'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  className,
  onLoad,
  onError,
  sizes,
  fill = false,
  style,
  loading = 'lazy',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!loading || loading === 'eager');
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'eager' || !imgRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters the viewport
        threshold: 0.1,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate responsive sizes if not provided
  const defaultSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

  // Generate blur placeholder if not provided
  const defaultBlurDataURL =
    blurDataURL ||
    `data:image/svg+xml;base64,${btoa(`
    <svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">Loading...</text>
    </svg>
  `)}`;

  if (hasError) {
    return (
      <div
        ref={imgRef}
        className={`flex items-center justify-center bg-muted text-sm text-muted-foreground ${className}`}
        style={{ width, height, ...style }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
    >
      {isInView && (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={defaultBlurDataURL}
          sizes={defaultSizes}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${fill ? 'object-cover' : ''}`}
          style={style}
          {...props}
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && isInView && (
        <div
          className='absolute inset-0 animate-pulse bg-muted'
          style={{ width, height }}
        />
      )}
    </div>
  );
}

// Preload critical images
export function preloadImage(src: string, as: 'image' = 'image') {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

// Generate WebP/AVIF fallbacks
export function generateImageSources(src: string) {
  const baseUrl = src.replace(/\.[^.]+$/, '');
  const extension = src.split('.').pop();

  return {
    webp: `${baseUrl}.webp`,
    avif: `${baseUrl}.avif`,
    original: src,
    fallback: extension === 'png' ? src.replace('.png', '.jpg') : src,
  };
}

// Image optimization utilities
export const imageUtils = {
  // Generate responsive image sizes
  generateSizes: (breakpoints: { [key: string]: string }) => {
    return Object.entries(breakpoints)
      .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
      .join(', ');
  },

  // Calculate optimal image dimensions
  calculateDimensions: (
    originalWidth: number,
    originalHeight: number,
    maxWidth: number = 1920,
    maxHeight: number = 1080
  ) => {
    const aspectRatio = originalWidth / originalHeight;

    let width = Math.min(originalWidth, maxWidth);
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return {
      width: Math.round(width),
      height: Math.round(height),
    };
  },

  // Generate srcSet for responsive images
  generateSrcSet: (src: string, widths: number[]) => {
    return widths.map(width => `${src}?w=${width} ${width}w`).join(', ');
  },
};
