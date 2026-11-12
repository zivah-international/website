import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
        glass: 'border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20',
        icon: 'rounded-full hover:bg-accent hover:text-accent-foreground',
        nav: 'text-foreground/70 transition-all hover:bg-accent/50 hover:text-foreground',
        'nav-active': 'bg-primary/8 font-semibold text-primary',
        'nav-mobile': 'w-full justify-start text-foreground hover:bg-accent',
        'cta-primary':
          'bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl',
        'cta-secondary':
          'bg-secondary text-secondary-foreground shadow-lg transition-all hover:bg-secondary/90 hover:shadow-xl',
        brand: 'rounded-[2px] bg-accent text-accent-foreground hover:bg-[var(--accent-hover)]',
        'brand-outline':
          'rounded-[2px] border border-primary/30 bg-transparent text-primary hover:border-primary hover:bg-primary/[0.04] dark:border-primary-foreground/30 dark:text-primary-foreground dark:hover:bg-white/[0.06]',
        'brand-inverse': 'rounded-[2px] bg-[#F6F4EF] text-[#0B2239] hover:bg-white',
        'brand-ghost':
          'rounded-none px-0 text-primary underline-offset-4 hover:text-accent hover:underline dark:text-primary-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-14 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
        nav: 'h-9 px-3',
        'nav-mobile': 'h-12 px-4',
        full: 'h-12 w-full',
        'full-lg': 'h-14 w-full',
        brand: 'h-11 px-6 text-[11.5px] font-semibold tracking-[0.1em] uppercase',
        'brand-sm': 'h-9 px-4 text-[10.5px] font-semibold tracking-[0.1em] uppercase',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
