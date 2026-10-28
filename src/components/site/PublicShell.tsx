import type { ReactNode } from 'react';

import Navigation from '@/components/Navigation';
import { cn } from '@/lib/utils';

export default function PublicShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <Navigation />
      <main id='main'>{children}</main>
    </div>
  );
}
