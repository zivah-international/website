type BrandLogoProps = {
  inverse?: boolean;
  decorative?: boolean;
  className?: string;
};

export default function BrandLogo({
  inverse = false,
  decorative = false,
  className = '',
}: BrandLogoProps) {
  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : 'ZIVAH International S.A.'}
      aria-hidden={decorative ? true : undefined}
      className={`inline-flex h-9 shrink-0 items-center gap-2 ${inverse ? 'text-primary-foreground' : 'text-primary dark:text-foreground'} ${className}`}
    >
      <svg
        aria-hidden='true'
        viewBox='0 0 64 64'
        className='h-9 w-9 shrink-0'
        fill='none'
      >
        <path
          d='M9 16C21 9 39 9 53 15'
          stroke='currentColor'
          strokeWidth='6'
          strokeLinecap='round'
        />
        <path
          d='M50 20C40 27 25 38 14 49'
          stroke='var(--accent)'
          strokeWidth='6'
          strokeLinecap='round'
        />
        <path
          d='M11 53C24 48 42 48 54 52'
          stroke='currentColor'
          strokeWidth='6'
          strokeLinecap='round'
        />
      </svg>
      <span
        aria-hidden='true'
        className='flex flex-col justify-center'
      >
        <span className='font-sans text-[18px] leading-[0.95] font-semibold tracking-[0.15em]'>
          ZIVAH
        </span>
        <span className='mt-1 font-sans text-[7px] leading-none font-medium tracking-[0.13em] text-current/75'>
          INTERNATIONAL S.A.
        </span>
      </span>
    </span>
  );
}
