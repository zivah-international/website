import type { ReactNode } from 'react';

type ContactLineProps = {
  label: string;
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  external?: boolean;
};

export default function ContactLine({
  label,
  href,
  children,
  icon,
  external = false,
}: ContactLineProps) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className='group flex items-center justify-between gap-4 border-b border-border py-3 text-foreground transition-colors hover:text-accent'
    >
      <span className='flex items-center gap-2 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase'>
        {icon}
        {label}
      </span>
      <span className='text-right text-[15px]'>{children}</span>
    </a>
  );
}
