'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorkerRegistration() {
  const [_isRegistered, setIsRegistered] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then(reg => {
          setRegistration(reg);
          setIsRegistered(true);

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });

          // Listen for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // New content is available
                    setUpdateAvailable(true);
                  } else {
                    // Content is cached for the first time
                  }
                }
              });
            }
          });
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });

      // Listen for controller change (when new SW takes control)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setUpdateAvailable(true);
        }
      });
    }
  }, []);

  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  // Don't render anything in development
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      {updateAvailable && (
        <div className='fixed right-4 bottom-4 z-50 rounded-lg bg-secondary px-4 py-3 text-white shadow-lg'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='font-medium'>Update Available</p>
              <p className='text-sm'>A new version is ready to install.</p>
            </div>
            <div className='ml-4 flex space-x-2'>
              <button
                onClick={updateServiceWorker}
                className='rounded bg-background px-3 py-1 text-sm font-medium text-secondary hover:bg-muted'
              >
                Update
              </button>
              <button
                onClick={() => setUpdateAvailable(false)}
                className='text-sm text-white hover:text-gray-200'
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Hook for service worker status
export function useServiceWorker() {
  const [isOnline, setIsOnline] = useState(true);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', event => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setIsUpdateAvailable(true);
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isUpdateAvailable };
}
