# Shadcn UI Components Guide

This guide explains how to use the shadcn/ui components in the ZIVAH International project.

## Overview

Shadcn/ui is now fully integrated into your project! It provides a collection of beautifully designed, accessible, and customizable components built on top of Radix UI and Tailwind CSS.

## Installed Components

### Core Components

- ✅ **Button** - Various button styles and sizes
- ✅ **Card** - Container component for content
- ✅ **Input** - Text input fields
- ✅ **Textarea** - Multi-line text input
- ✅ **Label** - Form labels
- ✅ **Form** - Form wrapper with validation support

### Navigation Components

- ✅ **Navigation Menu** - Complex navigation menus
- ✅ **Dropdown Menu** - Dropdown menus for actions
- ✅ **Sheet** - Slide-out panels (mobile menu)
- ✅ **Tabs** - Tabbed interfaces

### Feedback Components

- ✅ **Alert** - Alert messages (info, warning, error)
- ✅ **Alert Dialog** - Modal dialogs for confirmations
- ✅ **Sonner** - Toast notifications (replaces old toast)
- ✅ **Badge** - Status indicators and labels
- ✅ **Tooltip** - Contextual information on hover

### Layout Components

- ✅ **Separator** - Visual dividers
- ✅ **Accordion** - Collapsible content sections
- ✅ **Skeleton** - Loading placeholders
- ✅ **Progress** - Progress bars
- ✅ **Avatar** - User profile images
- ✅ **Hover Card** - Hoverable popover content

## Quick Start

### Using Buttons

```tsx
import { Button } from '@/components/ui/button';

export function MyComponent() {
  return (
    <div>
      <Button>Default</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='outline'>Outline</Button>
      <Button variant='destructive'>Delete</Button>
      <Button size='sm'>Small</Button>
      <Button size='lg'>Large</Button>
    </div>
  );
}
```

### Using Cards

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ProductCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Premium Shrimp</CardTitle>
        <CardDescription>Fresh from Ecuador</CardDescription>
      </CardHeader>
      <CardContent>
        <p>High-quality shrimp exports meeting international standards.</p>
      </CardContent>
      <CardFooter>
        <Button>Request Quote</Button>
      </CardFooter>
    </Card>
  );
}
```

### Using Forms

```tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Your name'
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter your full name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='your@email.com'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}
```

### Using Toast Notifications

The Toaster component is already added to your layout. Use it anywhere in your app:

```tsx
'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function MyComponent() {
  return (
    <Button
      onClick={() => {
        toast.success('Quote request submitted!', {
          description: 'We will contact you within 24 hours.',
        });
      }}
    >
      Request Quote
    </Button>
  );
}
```

### Using Alerts

```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function ImportantAlert() {
  return (
    <Alert variant='destructive'>
      <AlertCircle className='h-4 w-4' />
      <AlertTitle>Important Notice</AlertTitle>
      <AlertDescription>Shipping delays may occur during holiday seasons.</AlertDescription>
    </Alert>
  );
}
```

### Using Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ProductTabs() {
  return (
    <Tabs
      defaultValue='seafood'
      className='w-full'
    >
      <TabsList>
        <TabsTrigger value='seafood'>Seafood</TabsTrigger>
        <TabsTrigger value='fruits'>Fruits</TabsTrigger>
        <TabsTrigger value='coffee'>Coffee</TabsTrigger>
      </TabsList>
      <TabsContent value='seafood'>
        <Card>
          <CardHeader>
            <CardTitle>Premium Seafood</CardTitle>
            <CardDescription>Fresh from Ecuador's coast</CardDescription>
          </CardHeader>
          <CardContent>
            <p>High-quality shrimp and fish products.</p>
          </CardContent>
        </Card>
      </TabsContent>
      {/* Add other tabs */}
    </Tabs>
  );
}
```

### Using Accordion (FAQ)

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQ() {
  return (
    <Accordion
      type='single'
      collapsible
    >
      <AccordionItem value='item-1'>
        <AccordionTrigger>What products do you export?</AccordionTrigger>
        <AccordionContent>
          We export premium seafood, tropical fruits, and specialty coffee.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='item-2'>
        <AccordionTrigger>Which markets do you serve?</AccordionTrigger>
        <AccordionContent>We serve North America, Europe, and Asia.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

### Using Loading States

```tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

export function LoadingCard() {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-12 w-full' />
      <Skeleton className='h-4 w-3/4' />
      <Skeleton className='h-4 w-1/2' />
      <Progress value={66} />
    </div>
  );
}
```

## Adding More Components

To add more shadcn components:

```bash
npx shadcn@latest add [component-name]
```

Available components:

- `select` - Select dropdowns
- `checkbox` - Checkboxes
- `radio-group` - Radio buttons
- `switch` - Toggle switches
- `slider` - Range sliders
- `calendar` - Date picker calendar
- `date-picker` - Date picker input
- `popover` - Popover containers
- `dialog` - Modal dialogs
- `command` - Command palette
- `table` - Data tables
- And many more...

Browse all components at: https://ui.shadcn.com/docs/components

## Example Page

Check out the example component file at:

- `src/components/ShadcnExamples.tsx`

This file contains comprehensive examples of all installed components.

## Customization

### Theming

All components respect your Tailwind theme. Colors are defined using CSS variables in `src/app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... more variables */
}
```

### Component Variants

Most components support variants through the `class-variance-authority` library. Check each component's source code in `src/components/ui/` for available variants.

## Best Practices

1. **Use Client Components When Needed**: Components with interactivity need `'use client'` directive
2. **Combine with Lucide Icons**: All icons should come from `lucide-react`
3. **Form Validation**: Use `react-hook-form` with `zod` for form validation
4. **Accessibility**: All components are built with accessibility in mind
5. **Responsive Design**: Use Tailwind responsive classes (`sm:`, `md:`, `lg:`)

## Integration Examples for Your Project

### Enhanced Quote Form

Update your existing `QuoteForm.tsx` to use shadcn components:

- Replace form inputs with shadcn Input/Textarea
- Use Card component for form container
- Add toast notifications for success/error states
- Use Form component for validation

### Navigation Menu

Enhance your Navigation component:

- Use Navigation Menu for complex menus
- Use Sheet component for mobile menu
- Add Dropdown Menu for user actions

### Product Pages

- Use Tabs for different product categories
- Use Cards for product displays
- Add Badges for product status (In Stock, Seasonal, etc.)
- Use Accordion for FAQs

### Loading States

- Add Skeleton components while loading data
- Use Progress bars for upload/download progress

## Resources

- 📚 [Shadcn Documentation](https://ui.shadcn.com)
- 🎨 [Radix UI Documentation](https://www.radix-ui.com)
- 🎭 [Tailwind CSS](https://tailwindcss.com)
- 🔧 [React Hook Form](https://react-hook-form.com)
- ✅ [Zod Validation](https://zod.dev)

## Support

For issues or questions:

1. Check the [Shadcn FAQ](https://ui.shadcn.com/docs)
2. Review component documentation
3. Inspect component source in `src/components/ui/`

---

**Note**: All components are now ready to use throughout your ZIVAH International website!
