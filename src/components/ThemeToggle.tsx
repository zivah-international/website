'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useTheme } from '@/components/ThemeProvider';
import { useMounted } from '@/lib/hooks/use-mounted';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const t = useTranslations('nav');

  const isDark = resolvedTheme === 'dark';
  const label = isDark ? t('switchToLight') : t('switchToDark');

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      type='button'
      onClick={toggleTheme}
      disabled={!mounted}
      aria-label={mounted ? label : undefined}
      className='flex h-11 w-11 items-center justify-center rounded-[2px] border border-current/25 bg-transparent text-current transition-colors hover:bg-current/5 disabled:opacity-50'
    >
      <Sun
        aria-hidden='true'
        className={`h-5 w-5 stroke-current transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-100'}`}
      />
      <Moon
        aria-hidden='true'
        className={`-ml-5 h-5 w-5 stroke-current transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`}
      />
      <span className='sr-only'>{label}</span>
    </button>
  );
}
