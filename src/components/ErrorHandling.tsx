'use client';

import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            reset={() => this.setState({ hasError: false, error: null })}
          />
        );
      }

      return (
        <ErrorFallback
          error={this.state.error!}
          reset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations('common');

  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-4'>
      <div className='bg-card border-border w-full max-w-md rounded-xl border p-8 text-center shadow-lg'>
        <div className='mb-4 text-6xl'>⚠️</div>
        <h2 className='text-foreground mb-4 text-2xl font-bold'>{t('somethingWentWrong')}</h2>
        <p className='text-muted-foreground mb-6'>{t('unexpectedError')}</p>

        <div className='space-y-3'>
          <Button
            onClick={reset}
            className='w-full'
          >
            {t('tryAgain')}
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant='secondary'
            className='w-full'
          >
            {t('reloadPage')}
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className='mt-6 text-left'>
            <summary className='text-muted-foreground hover:text-foreground cursor-pointer text-sm'>
              {t('technicalDetails')}
            </summary>
            <pre className='bg-muted mt-2 overflow-auto rounded p-3 text-xs'>
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// Loading spinner component
export function LoadingSpinner({
  size = 'md',
  message,
}: {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}) {
  const t = useTranslations('common');
  const displayMessage = message ?? t('loading');

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className='flex flex-col items-center justify-center p-8'>
      <div
        className={`${sizeClasses[size]} border-accent/20 border-t-accent mb-4 animate-spin rounded-full border-4`}
      />
      {displayMessage && <p className='text-muted-foreground text-sm'>{displayMessage}</p>}
    </div>
  );
}

/**
 * @deprecated Use Skeleton from '@/components/ui/skeleton' instead.
 *
 * Example usage:
 * ```tsx
 * import { Skeleton } from '@/components/ui/skeleton';
 *
 * <div className="space-y-4">
 *   <Skeleton className="h-48 w-full" />
 *   <Skeleton className="h-4 w-full" />
 *   <Skeleton className="h-4 w-3/4" />
 * </div>
 * ```
 */
export function ProductSkeleton() {
  return (
    <div className='bg-card border-border animate-pulse rounded-xl border p-6'>
      <div className='bg-muted mb-4 h-48 w-full rounded-lg' />
      <div className='bg-muted mb-2 h-4 rounded' />
      <div className='bg-muted mb-4 h-3 rounded' />
      <div className='flex items-center justify-between'>
        <div className='bg-muted h-4 w-16 rounded' />
        <div className='bg-muted h-6 w-20 rounded' />
      </div>
    </div>
  );
}

/**
 * @deprecated Use Skeleton from '@/components/ui/skeleton' instead.
 *
 * Example usage:
 * ```tsx
 * import { Skeleton } from '@/components/ui/skeleton';
 *
 * <div className="space-y-4">
 *   <Skeleton className="h-8 w-3/4" />
 *   <Skeleton className="h-4 w-full" />
 *   <Skeleton className="h-4 w-5/6" />
 * </div>
 * ```
 */
export function ContentSkeleton() {
  return (
    <div className='animate-pulse space-y-4'>
      <div className='bg-muted h-8 w-3/4 rounded' />
      <div className='bg-muted h-4 w-full rounded' />
      <div className='bg-muted h-4 w-5/6 rounded' />
      <div className='bg-muted h-4 w-4/6 rounded' />
    </div>
  );
}

// Network status indicator
export function NetworkStatus() {
  const t = useTranslations('common');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className='bg-destructive text-destructive-foreground fixed right-4 bottom-4 z-50 rounded-lg px-4 py-2 shadow-lg'>
      <div className='flex items-center space-x-2'>
        <div className='h-2 w-2 animate-pulse rounded-full bg-white' />
        <span className='text-sm font-medium'>{t('offline')}</span>
      </div>
    </div>
  );
}

/**
 * @deprecated Use `import { toast } from 'sonner'` instead.
 * The Toaster component is already added to the layout.
 *
 * Example usage:
 * ```tsx
 * import { toast } from 'sonner';
 *
 * toast.success('Success message');
 * toast.error('Error message');
 * toast.warning('Warning message');
 * toast.info('Info message');
 * ```
 */
export function useToast() {
  return {
    toasts: [],
    addToast: () => {},
    removeToast: () => {},
  };
}
