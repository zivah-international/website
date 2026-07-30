import type { ReactElement, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const createIcon = (path: ReactElement, viewBox = '0 0 24 24') => {
  const Icon = ({ size = 16, className, ...props }: IconProps) => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox={viewBox}
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}
      {...props}
    >
      {path}
    </svg>
  );
  Icon.displayName = `Icon(${viewBox})`;
  return Icon;
};

export const Check = createIcon(<path d='M4.5 12.75l6 6 9-13.5' />);
Check.displayName = 'Check';

export const ArrowRight = createIcon(<path d='M17 8l4 4m0 0l-4 4m4-4H3' />);
ArrowRight.displayName = 'ArrowRight';

export const ArrowLeft = createIcon(<path d='M7 16l-4-4m0 0l4-4m-4 4h18' />);
ArrowLeft.displayName = 'ArrowLeft';

export const ChevronRight = createIcon(<path d='M9 5l7 7-7 7' />);
ChevronRight.displayName = 'ChevronRight';

export const QuoteIcon = createIcon(
  <path d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
);
QuoteIcon.displayName = 'QuoteIcon';

export const Home = createIcon(
  <path d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
);
Home.displayName = 'Home';

export const Package = createIcon(
  <path d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
);
Package.displayName = 'Package';

export const Shield = createIcon(
  <path d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
);
Shield.displayName = 'Shield';

export const Globe = createIcon(
  <path d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
);
Globe.displayName = 'Globe';

export const Mail = createIcon(
  <path d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
);
Mail.displayName = 'Mail';

export const Quote = createIcon(
  <path d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
);
Quote.displayName = 'Quote';

export const TestimonialQuote = createIcon(
  <path d='M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z' />,
  '0 0 24 24'
);
TestimonialQuote.displayName = 'TestimonialQuote';

export const Menu = createIcon(<path d='M4 6h16M4 12h16M4 18h16' />);
Menu.displayName = 'Menu';

export const X = createIcon(<path d='M6 18L18 6M6 6l12 12' />);
X.displayName = 'X';

export const Search = createIcon(<path d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />);
Search.displayName = 'Search';

export const ExternalLink = createIcon(
  <path d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
);
ExternalLink.displayName = 'ExternalLink';

export const Bell = createIcon(
  <path d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
);
Bell.displayName = 'Bell';

export const Linkedin = (props: IconProps) => (
  <svg
    fill='currentColor'
    viewBox='0 0 24 24'
    width={props.size || 16}
    height={props.size || 16}
    className={props.className}
  >
    <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
  </svg>
);
Linkedin.displayName = 'Linkedin';

export const Instagram = (props: IconProps) => (
  <svg
    fill='currentColor'
    viewBox='0 0 24 24'
    width={props.size || 16}
    height={props.size || 16}
    className={props.className}
  >
    <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' />
  </svg>
);
Instagram.displayName = 'Instagram';

export const Facebook = (props: IconProps) => (
  <svg
    fill='currentColor'
    viewBox='0 0 24 24'
    width={props.size || 16}
    height={props.size || 16}
    className={props.className}
  >
    <path
      fillRule='evenodd'
      d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
      clipRule='evenodd'
    />
  </svg>
);
Facebook.displayName = 'Facebook';
