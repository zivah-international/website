/**
 * Shadcn UI Components Example
 * This file demonstrates the usage of various shadcn/ui components
 * for the ZIVAH International website
 */

'use client';

import { AlertCircle, CheckCircle2, Coffee, Info, Package, Ship } from 'lucide-react';
import { useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ShadcnExamples() {
  const [loading, setLoading] = useState(false);

  return (
    <div className='container mx-auto space-y-8 p-8'>
      <div className='space-y-2 text-center'>
        <h1 className='text-4xl font-bold'>Shadcn UI Components</h1>
        <p className='text-muted-foreground'>UI/UX component examples for ZIVAH International</p>
      </div>

      <Separator />

      {/* Buttons Section */}
      <section className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Buttons</h2>
        <div className='flex flex-wrap gap-4'>
          <Button>Default Button</Button>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='destructive'>Destructive</Button>
          <Button variant='outline'>Outline</Button>
          <Button variant='ghost'>Ghost</Button>
          <Button variant='link'>Link</Button>
          <Button size='sm'>Small</Button>
          <Button size='lg'>Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <Separator />

      {/* Cards Section */}
      <section className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Cards</h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader>
              <Ship className='mb-2 h-8 w-8 text-blue-600' />
              <CardTitle>Premium Seafood</CardTitle>
              <CardDescription>High-quality shrimp and seafood exports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm'>
                Our seafood products meet the highest international standards for quality and
                sustainability.
              </p>
            </CardContent>
            <CardFooter>
              <Button className='w-full'>Learn More</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Package className='mb-2 h-8 w-8 text-green-600' />
              <CardTitle>Tropical Fruits</CardTitle>
              <CardDescription>Fresh from Ecuador</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm'>
                Bananas, passion fruit, and more exotic fruits delivered fresh.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className='w-full'
                variant='secondary'
              >
                View Products
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <Coffee className='mb-2 h-8 w-8 text-amber-700' />
              <CardTitle>Premium Coffee</CardTitle>
              <CardDescription>Ecuadorian specialty coffee</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground text-sm'>
                Arabica coffee beans from the best regions of Ecuador.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className='w-full'
                variant='outline'
              >
                Request Quote
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Alerts Section */}
      <section className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Alerts</h2>
        <div className='space-y-3'>
          <Alert>
            <Info className='h-4 w-4' />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Check our latest product catalog for seasonal offerings.
            </AlertDescription>
          </Alert>

          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Important Notice</AlertTitle>
            <AlertDescription>Shipping delays may occur during holiday seasons.</AlertDescription>
          </Alert>

          <Alert className='border-green-500 text-green-700 dark:text-green-400'>
            <CheckCircle2 className='h-4 w-4' />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Your quote request has been submitted successfully!</AlertDescription>
          </Alert>
        </div>
      </section>

      <Separator />

      {/* Badges Section */}
      <section className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Badges</h2>
        <div className='flex flex-wrap gap-2'>
          <Badge>Default</Badge>
          <Badge variant='secondary'>Secondary</Badge>
          <Badge variant='destructive'>Destructive</Badge>
          <Badge variant='outline'>Outline</Badge>
          <Badge className='bg-green-500'>Available</Badge>
          <Badge className='bg-amber-500'>Seasonal</Badge>
          <Badge className='bg-blue-500'>Premium</Badge>
        </div>
      </section>

      <Separator />

      {/* Form Section */}
      <section className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Form Elements</h2>
        <Card className='max-w-2xl'>
          <CardHeader>
            <CardTitle>Contact Form Example</CardTitle>
            <CardDescription>Quick contact form using shadcn components</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                placeholder='Your name'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='your@email.com'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='message'>Message</Label>
              <Textarea
                id='message'
                placeholder='Your message here...'
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className='w-full'>Send Message</Button>
          </CardFooter>
        </Card>
      </section>

      <Separator />

      {/* Tabs Section */}
      <section className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Tabs</h2>
        <Tabs
          defaultValue='products'
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='products'>Products</TabsTrigger>
            <TabsTrigger value='markets'>Markets</TabsTrigger>
            <TabsTrigger value='quality'>Quality</TabsTrigger>
          </TabsList>
          <TabsContent
            value='products'
            className='space-y-4'
          >
            <Card>
              <CardHeader>
                <CardTitle>Our Products</CardTitle>
                <CardDescription>Premium exports from Ecuador to the world</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  We specialize in high-quality seafood, tropical fruits, and specialty coffee
                  beans.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent
            value='markets'
            className='space-y-4'
          >
            <Card>
              <CardHeader>
                <CardTitle>Global Markets</CardTitle>
                <CardDescription>We serve clients across multiple continents</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our primary markets include North America, Europe, and Asia with distribution
                  centers worldwide.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent
            value='quality'
            className='space-y-4'
          >
            <Card>
              <CardHeader>
                <CardTitle>Quality Assurance</CardTitle>
                <CardDescription>Meeting international standards</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  All our products undergo rigorous quality control processes and meet international
                  certifications.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* Accordion Section */}
      <section className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Accordion (FAQ)</h2>
        <Accordion
          type='single'
          collapsible
          className='w-full max-w-2xl'
        >
          <AccordionItem value='item-1'>
            <AccordionTrigger>What products do you export?</AccordionTrigger>
            <AccordionContent>
              We export premium seafood (shrimp, fish), tropical fruits (bananas, passion fruit),
              and specialty coffee beans from Ecuador.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionTrigger>Which markets do you serve?</AccordionTrigger>
            <AccordionContent>
              We primarily serve North America, Europe, and Asia, with our main distribution center
              in Miami, Florida.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-3'>
            <AccordionTrigger>What certifications do you have?</AccordionTrigger>
            <AccordionContent>
              We hold international certifications for food safety, quality management, and
              sustainable sourcing practices.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Separator />

      {/* Loading States Section */}
      <section className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Loading States</h2>
        <div className='max-w-md space-y-4'>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
          <div className='space-y-2'>
            <Label>Loading Progress</Label>
            <Progress
              value={66}
              className='w-full'
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Avatar & Tooltip Section */}
      <section className='space-y-4'>
        <h2 className='text-2xl font-semibold'>Avatars & Tooltips</h2>
        <div className='flex items-center gap-4'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Avatar>
                  <AvatarImage src='https://github.com/shadcn.png' />
                  <AvatarFallback>ZI</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>ZIVAH International Team</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='outline'>Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a helpful tooltip</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </section>
    </div>
  );
}
