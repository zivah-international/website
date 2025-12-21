'use client';

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
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900'>
      <div className='w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800'>
        <div className='mb-4 text-6xl'>⚠️</div>
        <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>Algo salió mal</h2>
        <p className='mb-6 text-gray-600 dark:text-gray-400'>
          Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
        </p>

        <div className='space-y-3'>
          <Button
            onClick={reset}
            className='w-full'
          >
            Intentar de nuevo
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant='secondary'
            className='w-full'
          >
            Recargar página
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className='mt-6 text-left'>
            <summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'>
              Detalles técnicos
            </summary>
            <pre className='mt-2 overflow-auto rounded bg-gray-100 p-3 text-xs dark:bg-gray-700'>
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
  message = 'Cargando...',
}: {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}) {
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
      {message && <p className='text-sm text-gray-600 dark:text-gray-400'>{message}</p>}
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
    <div className='animate-pulse rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800'>
      <div className='mb-4 h-48 w-full rounded-lg bg-gray-200 dark:bg-gray-700' />
      <div className='mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700' />
      <div className='mb-4 h-3 rounded bg-gray-200 dark:bg-gray-700' />
      <div className='flex items-center justify-between'>
        <div className='h-4 w-16 rounded bg-gray-200 dark:bg-gray-700' />
        <div className='h-6 w-20 rounded bg-gray-200 dark:bg-gray-700' />
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
      <div className='h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700' />
      <div className='h-4 w-full rounded bg-gray-200 dark:bg-gray-700' />
      <div className='h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700' />
      <div className='h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700' />
    </div>
  );
}

// Network status indicator
export function NetworkStatus() {
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
    <div className='fixed right-4 bottom-4 z-50 rounded-lg bg-red-600 px-4 py-2 text-white shadow-lg'>
      <div className='flex items-center space-x-2'>
        <div className='h-2 w-2 animate-pulse rounded-full bg-white' />
        <span className='text-sm font-medium'>Sin conexión</span>
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
