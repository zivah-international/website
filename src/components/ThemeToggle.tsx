'use client';

import { useTheme } from '@/components/ThemeProvider';
import { useMounted } from '@/lib/hooks/use-mounted';

import { Button } from './ui/button';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button
        variant='ghost'
        size='icon'
        disabled
        className='relative overflow-hidden p-0'
      >
        <div className='relative h-5 w-5'>
          <div className='h-5 w-5 animate-pulse rounded bg-muted' />
        </div>
      </Button>
    );
  }

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
      className='group relative overflow-hidden border-border/50 bg-background/50 p-0 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:bg-accent/10'
    >
      <div className='relative h-5 w-5'>
        {/* Sun Icon — warm amber, reads naturally as "day" */}
        <svg
          className={`absolute inset-0 m-auto h-5 w-5 text-amber-500 transition-all duration-500 group-hover:text-amber-400 ${
            resolvedTheme === 'dark'
              ? 'scale-0 rotate-90 opacity-0'
              : 'scale-100 rotate-0 opacity-100'
          }`}
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path
            fillRule='evenodd'
            d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
            clipRule='evenodd'
          />
        </svg>

        {/* Moon Icon — secondary brand blue for dark mode */}
        <svg
          className={`absolute inset-0 m-auto h-5 w-5 text-secondary transition-all duration-500 group-hover:text-secondary/80 ${
            resolvedTheme === 'light'
              ? 'scale-0 -rotate-90 opacity-0'
              : 'scale-100 rotate-0 opacity-100'
          }`}
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
        </svg>
      </div>

      {/* Subtle glow effect on hover */}
      <div className='absolute inset-0 rounded-md bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
    </Button>
  );
}
