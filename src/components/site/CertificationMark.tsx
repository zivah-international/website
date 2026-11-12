import { cn } from '@/lib/utils';

type CertificationMarkProps = {
  code: string;
  name: string;
  description?: string;
  className?: string;
};

export default function CertificationMark({
  code,
  name,
  description,
  className,
}: CertificationMarkProps) {
  return (
    <div
      data-testid='certification-mark'
      className={cn(
        'flex h-full flex-col justify-between border border-border p-5 text-foreground',
        className
      )}
    >
      <p className='text-[11px] font-semibold tracking-[0.18em] uppercase'>{code}</p>
      <div className='mt-8'>
        <p className='font-serif text-lg leading-snug'>{name}</p>
        {description && (
          <p className='mt-1.5 text-[13px] leading-relaxed opacity-70'>{description}</p>
        )}
      </div>
    </div>
  );
}
