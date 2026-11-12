export const CERTIFICATIONS = [
  { code: 'BAP', name: 'Best Aquaculture Practices', scope: 'seafood' },
  { code: 'HACCP', name: 'Hazard Analysis Critical Control Points', scope: 'both' },
  { code: 'BRC', name: 'British Retail Consortium', scope: 'seafood' },
  { code: 'MSC', name: 'Marine Stewardship Council', scope: 'seafood' },
] as const;

export const MARKETS = [
  { code: 'US', status: 'active', cityKey: 'miami', x: 27, y: 40 },
  { code: 'JP', status: 'active', cityKey: 'tokyo', x: 82, y: 40 },
  { code: 'NL', status: 'active', cityKey: 'rotterdam', x: 49, y: 27 },
  { code: 'CN', status: 'active', cityKey: 'shanghai', x: 75, y: 46 },
  { code: 'CA', status: 'expansion', cityKey: 'toronto', x: 22, y: 30 },
  { code: 'AE', status: 'expansion', cityKey: 'dubai', x: 63, y: 48 },
] as const;

export const METRICS = {
  totalMarkets: MARKETS.length,
  activeMarkets: MARKETS.filter(market => market.status === 'active').length,
  certifications: CERTIFICATIONS.length,
  responseHours: 24,
  traceability: '100%',
} as const;
