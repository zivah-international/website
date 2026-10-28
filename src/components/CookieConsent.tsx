'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Link } from '@/i18n/routing';

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
        // Load and re-apply existing preferences so gtag honours them on this page load
        const savedPreferences = localStorage.getItem('cookie-preferences');
        if (savedPreferences) {
          const prefs: CookiePreferences = JSON.parse(savedPreferences);
          setPreferences(prefs);
          initializeTracking(prefs);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Explicitly deny all non-essential consent (required because default is 'denied'
    // but calling update ensures the tag honours the user's explicit choice on this session).
    initializeTracking(necessaryOnly);
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

  const preferenceSections = [
    {
      key: 'analytics' as const,
      title: t('analyticsCookies'),
      description: t('analyticsDescription'),
      enableLabel: t('enableAnalytics'),
      checked: preferences.analytics,
    },
    {
      key: 'functional' as const,
      title: t('functionalCookies'),
      description: t('functionalDescription'),
      enableLabel: t('enableFunctional'),
      checked: preferences.functional,
    },
    {
      key: 'marketing' as const,
      title: t('marketingCookies'),
      description: t('marketingDescription'),
      enableLabel: t('enableMarketing'),
      checked: preferences.marketing,
    },
  ];

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div
        role='dialog'
        aria-label={t('title')}
        className='fixed inset-x-3 bottom-3 z-50 max-w-[420px] rounded-[2px] border border-border bg-surface p-5 shadow-md sm:inset-x-auto sm:right-5 sm:bottom-5'
      >
        <h2 className='mb-2 text-base font-semibold text-foreground'>{t('title')}</h2>
        <p className='mb-4 text-sm leading-relaxed text-muted-foreground'>
          {t('description')}{' '}
          <Link
            href='/legal/cookie-policy'
            className='text-accent underline-offset-4 hover:underline'
          >
            {t('cookiePolicy')}
          </Link>
          .
        </p>

        <div className='flex flex-col gap-2'>
          <Button
            onClick={acceptAllCookies}
            variant='brand'
            size='brand'
            className='w-full'
          >
            {t('acceptAll')}
          </Button>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <Button
              onClick={() => setShowPreferences(true)}
              variant='brand-outline'
              size='brand'
            >
              {t('managePreferences')}
            </Button>
            <Button
              onClick={acceptNecessaryOnly}
              variant='brand-ghost'
              className='min-h-11 px-2 text-sm'
            >
              {t('onlyNecessary')}
            </Button>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2px] border border-border bg-surface shadow-lg'>
            <div className='p-6'>
              <div className='mb-6 flex items-center justify-between gap-4'>
                <h2 className='text-xl font-semibold text-foreground'>{t('preferencesTitle')}</h2>
                <button
                  type='button'
                  onClick={() => setShowPreferences(false)}
                  aria-label={t('close')}
                  className='flex h-11 w-11 shrink-0 items-center justify-center rounded-[2px] border border-current/25 text-muted-foreground transition-colors hover:text-foreground'
                >
                  <X
                    aria-hidden='true'
                    className='h-5 w-5 stroke-current'
                  />
                </button>
              </div>

              <div className='space-y-4'>
                {/* Necessary Cookies */}
                <div className='rounded-[2px] border border-border p-4'>
                  <div className='mb-2 flex items-center justify-between gap-4'>
                    <h3 className='font-semibold text-foreground'>{t('necessaryCookies')}</h3>
                    <span className='text-xs font-medium text-muted-foreground'>
                      {t('alwaysActive')}
                    </span>
                  </div>
                  <p className='text-sm text-muted-foreground'>{t('necessaryDescription')}</p>
                </div>

                {preferenceSections.map(section => (
                  <div
                    key={section.key}
                    className='rounded-[2px] border border-border p-4'
                  >
                    <div className='mb-2 flex items-center justify-between gap-4'>
                      <h3 className='font-semibold text-foreground'>{section.title}</h3>
                      <label className='relative inline-flex cursor-pointer items-center'>
                        <span className='sr-only'>{section.enableLabel}</span>
                        <input
                          type='checkbox'
                          checked={section.checked}
                          onChange={e => updatePreference(section.key, e.target.checked)}
                          className='peer sr-only'
                        />
                        <div className="peer h-6 w-11 rounded-full bg-muted peer-checked:bg-accent peer-focus:ring-4 peer-focus:ring-accent/30 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
                      </label>
                    </div>
                    <p className='text-sm text-muted-foreground'>{section.description}</p>
                  </div>
                ))}
              </div>

              <div className='mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row'>
                <Button
                  onClick={acceptNecessaryOnly}
                  variant='brand-outline'
                  size='brand'
                  className='flex-1'
                >
                  {t('onlyNecessary')}
                </Button>
                <Button
                  onClick={saveCustomPreferences}
                  variant='brand'
                  size='brand'
                  className='flex-1'
                >
                  {t('savePreferences')}
                </Button>
              </div>

              <p className='mt-4 text-center text-xs text-muted-foreground'>
                {t('moreInfo')}{' '}
                <Link
                  href='/legal/cookie-policy'
                  className='text-accent underline-offset-4 hover:underline'
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
