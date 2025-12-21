'use client';

import Image from 'next/image';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  once?: boolean;
  delay?: number;
}

export default function LazyLoad({
  children,
  fallback = null,
  rootMargin = '50px',
  threshold = 0.1,
  className = '',
  once = true,
  delay = 0,
}: LazyLoadProps) {
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => {
                setIsInView(true);
                setHasLoaded(true);
                if (once) observer.disconnect();
              }, delay);
            } else {
              setIsInView(true);
              setHasLoaded(true);
              if (once) observer.disconnect();
            }
          } else if (!once) {
            setIsInView(false);
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold, once, delay]);

  return (
    <div
      ref={elementRef}
      className={className}
    >
      {isInView ? children : fallback}
    </div>
  );
}

// Lazy load with animation
export function LazyLoadWithAnimation({
  children,
  animation = 'fadeIn',
  duration = 300,
  ...props
}: LazyLoadProps & {
  animation?: 'fadeIn' | 'slideUp' | 'slideIn' | 'scaleIn';
  duration?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  const animationStyles = {
    fadeIn: {
      opacity: isVisible ? 1 : 0,
      transition: `opacity ${duration}ms ease-in-out`,
    },
    slideUp: {
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      opacity: isVisible ? 1 : 0,
      transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
    },
    slideIn: {
      transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
      opacity: isVisible ? 1 : 0,
      transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
    },
    scaleIn: {
      transform: isVisible ? 'scale(1)' : 'scale(0.95)',
      opacity: isVisible ? 1 : 0,
      transition: `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
    },
  };

  return (
    <LazyLoad
      {...props}
      fallback={
        <div
          style={{
            ...animationStyles[animation],
            minHeight: '20px', // Prevent layout shift
          }}
        />
      }
    >
      <div
        style={animationStyles[animation]}
        onTransitionEnd={() => setIsVisible(true)}
      >
        {children}
      </div>
    </LazyLoad>
  );
}

// Lazy load images specifically
export function LazyImage({
  src,
  alt,
  className = '',
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 text-sm text-gray-500 ${className}`}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
    >
      {isLoaded && (
        <Image
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleLoad}
          onError={handleError}
          width={props.width || 400}
          height={props.height || 300}
          {...props}
        />
      )}
    </div>
  );
}

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const startTime = useRef<number | undefined>(undefined);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    startTime.current = performance.now();
    renderCount.current += 1;

    return () => {
      if (startTime.current) {
        const duration = performance.now() - startTime.current;
      }
    };
  });

  useEffect(() => {
    // Component lifecycle monitoring
    return () => {};
  }, [componentName]);
}

// Debounced lazy loading for lists
export function useDebouncedLazyLoad<T>(items: T[], batchSize: number = 10, delay: number = 100) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const loadMore = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const currentLength = visibleItems.length;
      const nextBatch = items.slice(currentLength, currentLength + batchSize);

      if (nextBatch.length > 0) {
        setVisibleItems(prev => [...prev, ...nextBatch]);
      } else {
        setHasMore(false);
      }
    }, delay);
  };

  useEffect(() => {
    // Load initial batch
    setVisibleItems(items.slice(0, batchSize));
    setHasMore(items.length > batchSize);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [items, batchSize]);

  return { visibleItems, hasMore, loadMore };
}
