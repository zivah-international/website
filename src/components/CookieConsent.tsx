'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { updateConsent } from './Analytics';
import { Button } from './ui/button';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export default function CookieConsent() {
  const t = useTranslations('cookies');
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    const consentDate = localStorage.getItem('cookie-consent-date');

    if (!consent) {
      // Show banner if no consent given
      setShowBanner(true);
    } else if (consentDate) {
      // Check if consent is older than 12 months (GDPR requirement)
      const consentDateTime = new Date(consentDate);
      const now = new Date();
      const monthsDiff = (now.getTime() - consentDateTime.getTime()) / (1000 * 60 * 60 * 24 * 30);

      if (monthsDiff > 12) {
        // Consent expired, show banner again
        localStorage.removeItem('cookie-consent');
        localStorage.removeItem('cookie-consent-date');
        localStorage.removeItem('cookie-preferences');
        setShowBanner(true);
      } else {
        // Load existing preferences
        const savedPreferences = localStorage.getItem('cookie-preferences');
        if (savedPreferences) {
          setPreferences(JSON.parse(savedPreferences));
        }
      }
    }
  }, []);

  const acceptAllCookies = () => {
    const allPreferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };

    setPreferences(allPreferences);
    saveConsent(allPreferences);
    setShowBanner(false);

    // Initialize tracking if accepted
    initializeTracking(allPreferences);
  };

  const acceptNecessaryOnly = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };

    setPreferences(necessaryOnly);
    saveConsent(necessaryOnly);
    setShowBanner(false);
  };

  const saveCustomPreferences = () => {
    saveConsent(preferences);
    setShowBanner(false);
    setShowPreferences(false);

    // Initialize tracking based on preferences
    initializeTracking(preferences);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
  };

  const initializeTracking = (prefs: CookiePreferences) => {
    // Update consent through Analytics component
    updateConsent({
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      functional: prefs.functional,
    });

    // Initialize functional cookies if accepted
    if (prefs.functional) {
      // Enable functional features like theme preference saving
      localStorage.setItem('functional-cookies-enabled', 'true');
    }
  };

  const updatePreference = (type: keyof CookiePreferences, value: boolean) => {
    if (type === 'necessary') return; // Cannot disable necessary cookies

    setPreferences(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className='fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col items-start gap-4 lg:flex-row lg:items-center'>
            <div className='flex-1'>
              <div className='mb-3 flex items-center gap-3'>
                <div className='text-2xl'>🍪</div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {t('title')}
                </h3>
              </div>
              <p className='text-sm leading-relaxed text-gray-700 dark:text-gray-300'>
                {t('description')}{' '}
                <Link
                  href='/legal/cookie-policy'
                  className='text-accent dark:text-accent hover:underline'
                >
                  {t('cookiePolicy')}
                </Link>
                .
              </p>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row lg:ml-6'>
              <Button
                onClick={() => setShowPreferences(true)}
                variant='secondary'
                size='sm'
              >
                {t('managePreferences')}
              </Button>
              <Button
                onClick={acceptNecessaryOnly}
                variant='outline'
                size='sm'
              >
                {t('onlyNecessary')}
              </Button>
              <Button
                onClick={acceptAllCookies}
                variant='accent'
                size='sm'
              >
                {t('acceptAll')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
          <div className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-gray-800'>
            <div className='p-6'>
              <div className='mb-6 flex items-center justify-between'>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                  {t('preferencesTitle')}
                </h3>
                <button
                  onClick={() => setShowPreferences(false)}
                  className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                >
                  ✕
                </button>
              </div>

              <div className='space-y-6'>
                {/* Necessary Cookies */}
                <div className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
                  <div className='mb-3 flex items-center justify-between'>
                    <h4 className='font-semibold text-gray-900 dark:text-white'>
                      {t('necessaryCookies')}
                    </h4>
                    <span className='bg-accent/10 dark:bg-accent/20 dark:text-accent rounded px-2 py-1 text-xs text-gray-800'>
                      {t('alwaysActive')}
                    </span>
                  </div>
                  <p className='mb-3 text-sm text-gray-600 dark:text-gray-400'>
                    {t('necessaryDescription')}
                  </p>
                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={preferences.necessary}
                      disabled
                      className='mr-3'
                    />
                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                      {t('necessary')}
                    </span>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
                  <div className='mb-3 flex items-center justify-between'>
                    <h4 className='font-semibold text-gray-900 dark:text-white'>
                      {t('analyticsCookies')}
                    </h4>
                    <label className='relative inline-flex cursor-pointer items-center'>
                      <span className='sr-only'>{t('enableAnalytics')}</span>
                      <input
                        type='checkbox'
                        checked={preferences.analytics}
                        onChange={e => updatePreference('analytics', e.target.checked)}
                        className='peer sr-only'
                      />
                      <div className="peer-focus:ring-accent/30 dark:peer-focus:ring-accent/50 peer peer-checked:bg-accent h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700" />
                    </label>
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('analyticsDescription')}
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
                  <div className='mb-3 flex items-center justify-between'>
                    <h4 className='font-semibold text-gray-900 dark:text-white'>
                      {t('functionalCookies')}
                    </h4>
                    <label className='relative inline-flex cursor-pointer items-center'>
                      <span className='sr-only'>{t('enableFunctional')}</span>
                      <input
                        type='checkbox'
                        checked={preferences.functional}
                        onChange={e => updatePreference('functional', e.target.checked)}
                        className='peer sr-only'
                      />
                      <div className="peer-focus:ring-accent/30 dark:peer-focus:ring-accent/50 peer peer-checked:bg-accent h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700" />
                    </label>
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('functionalDescription')}
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'>
                  <div className='mb-3 flex items-center justify-between'>
                    <h4 className='font-semibold text-gray-900 dark:text-white'>
                      {t('marketingCookies')}
                    </h4>
                    <label className='relative inline-flex cursor-pointer items-center'>
                      <span className='sr-only'>{t('enableMarketing')}</span>
                      <input
                        type='checkbox'
                        checked={preferences.marketing}
                        onChange={e => updatePreference('marketing', e.target.checked)}
                        className='peer sr-only'
                      />
                      <div className="peer-focus:ring-accent/30 dark:peer-focus:ring-accent/50 peer peer-checked:bg-accent h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700" />
                    </label>
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t('marketingDescription')}
                  </p>
                </div>
              </div>

              <div className='border-border mt-6 flex flex-col gap-3 border-t pt-6 sm:flex-row'>
                <Button
                  onClick={acceptNecessaryOnly}
                  variant='outline'
                  size='default'
                  className='flex-1'
                >
                  {t('onlyNecessary')}
                </Button>
                <Button
                  onClick={saveCustomPreferences}
                  variant='accent'
                  size='default'
                  className='flex-1'
                >
                  {t('savePreferences')}
                </Button>
              </div>

              <p className='mt-4 text-center text-xs text-gray-500 dark:text-gray-400'>
                {t('moreInfo')}{' '}
                <Link
                  href='/legal/cookie-policy'
                  className='text-accent dark:text-accent hover:underline'
                >
                  {t('cookiePolicy')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
