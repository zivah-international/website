import { cn } from '@/lib/utils';

type ProcessStepProps = {
  index: string;
  title: string;
  description: string;
  className?: string;
};

export default function ProcessStep({ index, title, description, className }: ProcessStepProps) {
  return (
    <li
      data-testid='process-step'
      className={cn('border-t border-border pt-6', className)}
    >
      <span className='text-[11px] font-semibold tracking-[0.18em] text-accent uppercase'>
        {index}
      </span>
      <h3 className='mt-3 text-xl leading-snug text-foreground'>{title}</h3>
      <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>{description}</p>
    </li>
  );
}
