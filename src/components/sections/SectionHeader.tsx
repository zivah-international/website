interface SectionHeaderProps {
  badge?: string;
  badgeColor?: 'primary' | 'secondary' | 'accent';
  title: string;
  description?: string;
  className?: string;
}

const badgeStyles = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-accent/10 text-accent',
};

export default function SectionHeader({
  badge,
  badgeColor = 'primary',
  title,
  description,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`mb-10 text-center ${className}`}>
      {badge && (
        <div
          className={`mb-3 inline-block rounded-full px-4 py-1.5 text-sm font-semibold ${badgeStyles[badgeColor]}`}
        >
          {badge}
        </div>
      )}
      <h2 className='mb-4 text-3xl font-bold text-foreground sm:text-4xl'>{title}</h2>
      {description && (
        <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>{description}</p>
      )}
    </div>
  );
}
