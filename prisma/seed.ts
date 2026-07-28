import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { PrismaClient } from '../generated/prisma/client';

function getAdapterFromDatabaseUrl(databaseUrl: string) {
  const pool = new Pool({
    connectionString: databaseUrl,
  });

  return new PrismaPg(pool);
}

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

const prisma = new PrismaClient({
  adapter: getAdapterFromDatabaseUrl(databaseUrl),
});

async function main() {
  console.log('🌱 Starting comprehensive database seed...');

  // Create currencies first
  console.log('💰 Creating currencies...');
  const usd = await prisma.currency.upsert({
    where: { code: 'USD' },
    update: {},
    create: {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      isActive: true,
      sortOrder: 1,
    },
  });

  const cop = await prisma.currency.upsert({
    where: { code: 'COP' },
    update: {},
    create: {
      code: 'COP',
      name: 'Colombian Peso',
      symbol: '$',
      isActive: true,
      sortOrder: 2,
    },
  });

  const pen = await prisma.currency.upsert({
    where: { code: 'PEN' },
    update: {},
    create: {
      code: 'PEN',
      name: 'Peruvian Sol',
      symbol: 'S/',
      isActive: true,
      sortOrder: 3,
    },
  });

  const clp = await prisma.currency.upsert({
    where: { code: 'CLP' },
    update: {},
    create: {
      code: 'CLP',
      name: 'Chilean Peso',
      symbol: '$',
      isActive: true,
      sortOrder: 4,
    },
  });

  const mxn = await prisma.currency.upsert({
    where: { code: 'MXN' },
    update: {},
    create: {
      code: 'MXN',
      name: 'Mexican Peso',
      symbol: '$',
      isActive: true,
      sortOrder: 5,
    },
  });

  const eur = await prisma.currency.upsert({
    where: { code: 'EUR' },
    update: {},
    create: {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      isActive: true,
      sortOrder: 6,
    },
  });

  const cny = await prisma.currency.upsert({
    where: { code: 'CNY' },
    update: {},
    create: {
      code: 'CNY',
      name: 'Chinese Yuan',
      symbol: '¥',
      isActive: true,
      sortOrder: 7,
    },
  });

  const jpy = await prisma.currency.upsert({
    where: { code: 'JPY' },
    update: {},
    create: {
      code: 'JPY',
      name: 'Japanese Yen',
      symbol: '¥',
      isActive: true,
      sortOrder: 8,
    },
  });

  const gbp = await prisma.currency.upsert({
    where: { code: 'GBP' },
    update: {},
    create: {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      isActive: true,
      sortOrder: 9,
    },
  });

  const cad = await prisma.currency.upsert({
    where: { code: 'CAD' },
    update: {},
    create: {
      code: 'CAD',
      name: 'Canadian Dollar',
      symbol: 'C$',
      isActive: true,
      sortOrder: 10,
    },
  });

  const brl = await prisma.currency.upsert({
    where: { code: 'BRL' },
    update: {},
    create: {
      code: 'BRL',
      name: 'Brazilian Real',
      symbol: 'R$',
      isActive: true,
      sortOrder: 11,
    },
  });

  const ars = await prisma.currency.upsert({
    where: { code: 'ARS' },
    update: {},
    create: {
      code: 'ARS',
      name: 'Argentine Peso',
      symbol: '$',
      isActive: true,
      sortOrder: 12,
    },
  });

  const krw = await prisma.currency.upsert({
    where: { code: 'KRW' },
    update: {},
    create: {
      code: 'KRW',
      name: 'South Korean Won',
      symbol: '₩',
      isActive: true,
      sortOrder: 13,
    },
  });

  const aud = await prisma.currency.upsert({
    where: { code: 'AUD' },
    update: {},
    create: {
      code: 'AUD',
      name: 'Australian Dollar',
      symbol: 'A$',
      isActive: true,
      sortOrder: 14,
    },
  });

  const chf = await prisma.currency.upsert({
    where: { code: 'CHF' },
    update: {},
    create: {
      code: 'CHF',
      name: 'Swiss Franc',
      symbol: 'CHF',
      isActive: true,
      sortOrder: 15,
    },
  });

  // Create countries for international operations
  console.log('🌍 Creating countries...');
  const ecuador = await prisma.country.upsert({
    where: { code: 'EC' },
    update: {},
    create: {
      name: 'Ecuador',
      code: 'EC',
      icon: '🇪🇨',
      continent: 'South America',
      currencyId: usd.id,
      callingCode: '+593',
      phoneFormat: '+593 XX XXX XXXX',
      isActive: true,
    },
  });

  const usa = await prisma.country.upsert({
    where: { code: 'US' },
    update: {},
    create: {
      name: 'United States',
      code: 'US',
      icon: '🇺🇸',
      continent: 'North America',
      currencyId: usd.id,
      callingCode: '+1',
      phoneFormat: '+1 (XXX) XXX-XXXX',
      isActive: true,
    },
  });

  const colombia = await prisma.country.upsert({
    where: { code: 'CO' },
    update: {},
    create: {
      name: 'Colombia',
      code: 'CO',
      icon: '🇨🇴',
      continent: 'South America',
      currencyId: cop.id,
      callingCode: '+57',
      phoneFormat: '+57 XXX XXX XXXX',
      isActive: true,
    },
  });

  const peru = await prisma.country.upsert({
    where: { code: 'PE' },
    update: {},
    create: {
      name: 'Peru',
      code: 'PE',
      icon: '🇵🇪',
      continent: 'South America',
      currencyId: pen.id,
      callingCode: '+51',
      phoneFormat: '+51 XXX XXX XXX',
      isActive: true,
    },
  });

  const chile = await prisma.country.upsert({
    where: { code: 'CL' },
    update: {},
    create: {
      name: 'Chile',
      code: 'CL',
      icon: '🇨🇱',
      continent: 'South America',
      currencyId: clp.id,
      callingCode: '+56',
      phoneFormat: '+56 X XXXX XXXX',
      isActive: true,
    },
  });

  const mexico = await prisma.country.upsert({
    where: { code: 'MX' },
    update: {},
    create: {
      name: 'Mexico',
      code: 'MX',
      icon: '🇲🇽',
      continent: 'North America',
      currencyId: mxn.id,
      callingCode: '+52',
      phoneFormat: '+52 XX XXXX XXXX',
      isActive: true,
    },
  });

  const spain = await prisma.country.upsert({
    where: { code: 'ES' },
    update: {},
    create: {
      name: 'Spain',
      code: 'ES',
      icon: '🇪🇸',
      continent: 'Europe',
      currencyId: eur.id,
      callingCode: '+34',
      phoneFormat: '+34 XXX XXX XXX',
      isActive: true,
    },
  });

  const china = await prisma.country.upsert({
    where: { code: 'CN' },
    update: {},
    create: {
      name: 'China',
      code: 'CN',
      icon: '🇨🇳',
      continent: 'Asia',
      currencyId: cny.id,
      callingCode: '+86',
      phoneFormat: '+86 XXX XXXX XXXX',
      isActive: true,
    },
  });

  const japan = await prisma.country.upsert({
    where: { code: 'JP' },
    update: {},
    create: {
      name: 'Japan',
      code: 'JP',
      icon: '🇯🇵',
      continent: 'Asia',
      currencyId: jpy.id,
      callingCode: '+81',
      phoneFormat: '+81 XX XXXX XXXX',
      isActive: true,
    },
  });

  const germany = await prisma.country.upsert({
    where: { code: 'DE' },
    update: {},
    create: {
      name: 'Germany',
      code: 'DE',
      icon: '🇩🇪',
      continent: 'Europe',
      currencyId: eur.id,
      callingCode: '+49',
      phoneFormat: '+49 XXX XXXXXXX',
      isActive: true,
    },
  });

  // Additional countries that commonly import from Ecuador
  const italy = await prisma.country.upsert({
    where: { code: 'IT' },
    update: {},
    create: {
      name: 'Italy',
      code: 'IT',
      icon: '🇮🇹',
      continent: 'Europe',
      currency: { connect: { id: eur.id } },
      callingCode: '+39',
      phoneFormat: '+39 XXX XXX XXXX',
      isActive: true,
    },
  });

  const france = await prisma.country.upsert({
    where: { code: 'FR' },
    update: {},
    create: {
      name: 'France',
      code: 'FR',
      icon: '🇫🇷',
      continent: 'Europe',
      currencyId: eur.id,
      callingCode: '+33',
      phoneFormat: '+33 X XX XX XX XX',
      isActive: true,
    },
  });

  const uk = await prisma.country.upsert({
    where: { code: 'GB' },
    update: {},
    create: {
      name: 'United Kingdom',
      code: 'GB',
      icon: '🇬🇧',
      continent: 'Europe',
      currencyId: gbp.id,
      callingCode: '+44',
      phoneFormat: '+44 XXXX XXX XXX',
      isActive: true,
    },
  });

  const canada = await prisma.country.upsert({
    where: { code: 'CA' },
    update: {},
    create: {
      name: 'Canada',
      code: 'CA',
      icon: '🇨🇦',
      continent: 'North America',
      currencyId: cad.id,
      callingCode: '+1',
      phoneFormat: '+1 (XXX) XXX-XXXX',
      isActive: true,
    },
  });

  const brazil = await prisma.country.upsert({
    where: { code: 'BR' },
    update: {},
    create: {
      name: 'Brazil',
      code: 'BR',
      icon: '🇧🇷',
      continent: 'South America',
      currencyId: brl.id,
      callingCode: '+55',
      phoneFormat: '+55 XX XXXXX-XXXX',
      isActive: true,
    },
  });

  const argentina = await prisma.country.upsert({
    where: { code: 'AR' },
    update: {},
    create: {
      name: 'Argentina',
      code: 'AR',
      icon: '🇦🇷',
      continent: 'South America',
      currencyId: ars.id,
      callingCode: '+54',
      phoneFormat: '+54 XX XXXX-XXXX',
      isActive: true,
    },
  });

  const southKorea = await prisma.country.upsert({
    where: { code: 'KR' },
    update: {},
    create: {
      name: 'South Korea',
      code: 'KR',
      icon: '🇰🇷',
      continent: 'Asia',
      currencyId: krw.id,
      callingCode: '+82',
      phoneFormat: '+82 XX XXXX XXXX',
      isActive: true,
    },
  });

  const australia = await prisma.country.upsert({
    where: { code: 'AU' },
    update: {},
    create: {
      name: 'Australia',
      code: 'AU',
      icon: '🇦🇺',
      continent: 'Oceania',
      currencyId: aud.id,
      callingCode: '+61',
      phoneFormat: '+61 XXX XXX XXX',
      isActive: true,
    },
  });

  const netherlands = await prisma.country.upsert({
    where: { code: 'NL' },
    update: {},
    create: {
      name: 'Netherlands',
      code: 'NL',
      icon: '🇳🇱',
      continent: 'Europe',
      currencyId: eur.id,
      callingCode: '+31',
      phoneFormat: '+31 XX XXX XXXX',
      isActive: true,
    },
  });

  const belgium = await prisma.country.upsert({
    where: { code: 'BE' },
    update: {},
    create: {
      name: 'Belgium',
      code: 'BE',
      icon: '🇧🇪',
      continent: 'Europe',
      currencyId: eur.id,
      callingCode: '+32',
      phoneFormat: '+32 XXX XX XX XX',
      isActive: true,
    },
  });

  const switzerland = await prisma.country.upsert({
    where: { code: 'CH' },
    update: {},
    create: {
      name: 'Switzerland',
      code: 'CH',
      icon: '🇨🇭',
      continent: 'Europe',
      currencyId: chf.id,
      callingCode: '+41',
      phoneFormat: '+41 XX XXX XX XX',
      isActive: true,
    },
  });

  // Create measure families first
  console.log('📏 Creating measure families...');
  const weightFamily = await prisma.measureFamily.upsert({
    where: { name: 'Weight' },
    update: {},
    create: {
      name: 'Weight',
      code: 'WEIGHT',
      description: 'Units for measuring weight/mass',
      isActive: true,
      sortOrder: 1,
    },
  });

  const volumeFamily = await prisma.measureFamily.upsert({
    where: { name: 'Volume' },
    update: {},
    create: {
      name: 'Volume',
      code: 'VOLUME',
      description: 'Units for measuring volume/capacity',
      isActive: true,
      sortOrder: 2,
    },
  });

  const countFamily = await prisma.measureFamily.upsert({
    where: { name: 'Count' },
    update: {},
    create: {
      name: 'Count',
      code: 'COUNT',
      description: 'Units for counting items',
      isActive: true,
      sortOrder: 3,
    },
  });

  const areaFamily = await prisma.measureFamily.upsert({
    where: { name: 'Area' },
    update: {},
    create: {
      name: 'Area',
      code: 'AREA',
      description: 'Units for measuring area/surface',
      isActive: true,
      sortOrder: 4,
    },
  });

  // Create measurement units for export products
  console.log('📏 Creating measurement units...');

  // Weight measures
  const kilogram = await prisma.measure.upsert({
    where: { name: 'Kilogram' },
    update: {},
    create: {
      name: 'Kilogram',
      shortName: 'kg',
      symbol: 'kg',
      type: 'WEIGHT',
      familyId: weightFamily.id,
      baseUnit: 'kg',
      conversionFactor: 1.0,
      isActive: true,
      sortOrder: 1,
      description: 'Standard metric unit for weight',
    },
  });

  const metricTon = await prisma.measure.upsert({
    where: { name: 'Metric Ton' },
    update: {},
    create: {
      name: 'Metric Ton',
      shortName: 'MT',
      symbol: 't',
      type: 'WEIGHT',
      familyId: weightFamily.id,
      baseUnit: 'kg',
      conversionFactor: 1000.0,
      isActive: true,
      sortOrder: 2,
      description: 'Metric ton - 1000 kilograms',
    },
  });

  const pound = await prisma.measure.upsert({
    where: { name: 'Pound' },
    update: {},
    create: {
      name: 'Pound',
      shortName: 'lb',
      symbol: 'lb',
      type: 'WEIGHT',
      familyId: weightFamily.id,
      baseUnit: 'kg',
      conversionFactor: 0.453592,
      isActive: true,
      sortOrder: 3,
      description: 'Imperial pound unit',
    },
  });

  // Volume measures
  const liter = await prisma.measure.upsert({
    where: { name: 'Liter' },
    update: {},
    create: {
      name: 'Liter',
      shortName: 'L',
      symbol: 'L',
      type: 'VOLUME',
      familyId: volumeFamily.id,
      baseUnit: 'L',
      conversionFactor: 1.0,
      isActive: true,
      sortOrder: 10,
      description: 'Standard metric unit for volume',
    },
  });

  const cubicMeter = await prisma.measure.upsert({
    where: { name: 'Cubic Meter' },
    update: {},
    create: {
      name: 'Cubic Meter',
      shortName: 'm³',
      symbol: 'm³',
      type: 'VOLUME',
      familyId: volumeFamily.id,
      baseUnit: 'L',
      conversionFactor: 1000.0,
      isActive: true,
      sortOrder: 11,
      description: 'Cubic meter - 1000 liters',
    },
  });

  const gallon = await prisma.measure.upsert({
    where: { name: 'Gallon' },
    update: {},
    create: {
      name: 'Gallon',
      shortName: 'gal',
      symbol: 'gal',
      type: 'VOLUME',
      baseUnit: 'L',
      conversionFactor: 3.78541,
      isActive: true,
      sortOrder: 12,
      description: 'US gallon',
    },
  });

  // Container measures (common in export)
  const container20ft = await prisma.measure.upsert({
    where: { name: '20ft Container' },
    update: {},
    create: {
      name: '20ft Container',
      shortName: '20ft',
      symbol: '20"',
      type: 'CONTAINER',
      baseUnit: 'container',
      conversionFactor: 1.0,
      isActive: true,
      sortOrder: 20,
      description: 'Standard 20-foot shipping container',
    },
  });

  const container40ft = await prisma.measure.upsert({
    where: { name: '40ft Container' },
    update: {},
    create: {
      name: '40ft Container',
      shortName: '40ft',
      symbol: '40"',
      type: 'CONTAINER',
      baseUnit: 'container',
      conversionFactor: 1.0,
      isActive: true,
      sortOrder: 21,
      description: 'Standard 40-foot shipping container',
    },
  });

  const container40ftHC = await prisma.measure.upsert({
    where: { name: '40ft High Cube Container' },
    update: {},
    create: {
      name: '40ft High Cube Container',
      shortName: '40HC',
      symbol: '40HC',
      type: 'CONTAINER',
      baseUnit: 'container',
      conversionFactor: 1.0,
      isActive: true,
      sortOrder: 22,
      description: 'High cube 40-foot shipping container',
    },
  });

  // Quantity measures
  const pieces = await prisma.measure.upsert({
    where: { name: 'Pieces' },
    update: {},
    create: {
      name: 'Pieces',
      shortName: 'pcs',
      symbol: 'pcs',
      type: 'QUANTITY',
      baseUnit: 'pieces',
      conversionFactor: 1.0,
      isActive: true,
      sortOrder: 30,
      description: 'Individual pieces or units',
    },
  });

  const dozen = await prisma.measure.upsert({
    where: { name: 'Dozen' },
    update: {},
    create: {
      name: 'Dozen',
      shortName: 'dz',
      symbol: 'dz',
      type: 'QUANTITY',
      baseUnit: 'pieces',
      conversionFactor: 12.0,
      isActive: true,
      sortOrder: 31,
      description: 'Dozen - 12 pieces',
    },
  });

  const carton = await prisma.measure.upsert({
    where: { name: 'Carton' },
    update: {},
    create: {
      name: 'Carton',
      shortName: 'ctn',
      symbol: 'ctn',
      type: 'QUANTITY',
      baseUnit: 'carton',
      conversionFactor: 1.0,
      isActive: true,
      sortOrder: 32,
      description: 'Export carton packaging',
    },
  });

  const pallet = await prisma.measure.upsert({
    where: { name: 'Pallet' },
    update: {},
    create: {
      name: 'Pallet',
      shortName: 'plt',
      symbol: 'plt',
      type: 'QUANTITY',
      baseUnit: 'pallet',
      conversionFactor: 1.0,
      isActive: true,
      sortOrder: 33,
      description: 'Export pallet',
    },
  });

  // Length measures (for some products)
  const meter = await prisma.measure.upsert({
    where: { name: 'Meter' },
    update: {},
    create: {
      name: 'Meter',
      shortName: 'm',
      symbol: 'm',
      type: 'LENGTH',
      baseUnit: 'm',
      conversionFactor: 1.0,
      isActive: true,
      sortOrder: 40,
      description: 'Standard metric unit for length',
    },
  });

  const feet = await prisma.measure.upsert({
    where: { name: 'Feet' },
    update: {},
    create: {
      name: 'Feet',
      shortName: 'ft',
      symbol: 'ft',
      type: 'LENGTH',
      baseUnit: 'm',
      conversionFactor: 0.3048,
      isActive: true,
      sortOrder: 41,
      description: 'Imperial feet unit',
    },
  });

  // Create comprehensive categories according to Ecuador's main exports
  console.log('🏷️ Creating Ecuadorian export categories...');
  const agricolasCategory = await prisma.category.upsert({
    where: { slug: 'agricolas' },
    update: {},
    create: {
      name: 'Agrícolas',
      slug: 'agricolas',
      description:
        'Banano: Ecuador es uno de los mayores exportadores mundiales de banano. Cacao: El país es un importante exportador de cacao fino y de aroma, usado para la elaboración de chocolate de alta calidad. Flores: Ecuador es un gran productor de flores, especialmente rosas, y es uno de los principales exportadores mundiales de este producto. Café: El país cultiva diversas variedades de café, exportando un producto aromático y de alta demanda. Otras frutas: También se exportan otras frutas como la piña, el brócoli y los jugos y conservas de frutas.',
      icon: '🌱',
      color: '#4CAF50',
      sortOrder: 1,
      isActive: true,
    },
  });

  const marinosCategory = await prisma.category.upsert({
    where: { slug: 'marinos-y-pesca' },
    update: {},
    create: {
      name: 'Marinos y de la Pesca',
      slug: 'marinos-y-pesca',
      description:
        'Camarón: Ecuador es un líder mundial en la exportación de crustáceos, principalmente camarón y langostino. Pescado: Se exporta pescado, incluyendo atún, así como productos procesados y enlatados.',
      icon: '🦐',
      color: '#2196F3',
      sortOrder: 2,
      isActive: true,
    },
  });

  const otrosCategory = await prisma.category.upsert({
    where: { slug: 'otros-productos' },
    update: {},
    create: {
      name: 'Otros Productos',
      slug: 'otros-productos',
      description:
        'Manufacturas: Se exportan algunas manufacturas, como las de metales y los elaborados de banano. Madera: La madera es otro producto de exportación del país. Aceites y grasas: También se incluyen productos como el aceite de palma y aceites de pescado.',
      icon: '📦',
      color: '#795548',
      sortOrder: 3,
      isActive: true,
    },
  });

  console.log('📦 Creating comprehensive products...');

  // BANANO - Main Ecuadorian agricultural export
  await prisma.product.upsert({
    where: { slug: 'banano-cavendish-premium' },
    update: {},
    create: {
      name: 'Banano Cavendish Premium',
      slug: 'banano-cavendish-premium',
      code: 'AGR-BAN-001', // Agricultural - Banano code
      categoryId: agricolasCategory.id,
      measureId: container40ft.id, // Agricultural products default to 40ft containers
      description:
        'Banano Cavendish de exportación premium cultivado en la costa ecuatoriana. Ecuador es uno de los mayores exportadores mundiales de banano con excelente calidad y vida útil.',
      shortDescription: 'Banano premium de exportación con certificación internacional',
      sku: 'BAN-CAV-001',
      specifications: {
        weight: '90-150g',
        size: '16-22cm',
        calibre: '38-48mm',
        harvest: 'Todo el año',
        packaging: 'Cajas de 18.14kg (11-16 manos)',
        containerCapacity: '19-20 toneladas por contenedor 40ft',
        features: [
          'Calibre: 38-48mm',
          'Peso promedio: 90-150g por unidad',
          'Longitud: 16-22cm',
          'Vida útil: 14-21 días',
          'Certificación GlobalGAP y Rainforest Alliance',
          'Capacidad: ~20,000kg por contenedor 40ft',
        ],
      },
      stockQuantity: 150, // containers available
      minOrderQty: 1, // minimum 1 container
      imageUrl: '/assets/images/products/banano-cavendish.jpg',
      imageGallery: [
        '/assets/images/products/banano-1.jpg',
        '/assets/images/products/banano-2.jpg',
      ],
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'Rainforest Alliance', 'HACCP', 'Orgánico'],
      nutritionalInfo: {
        calories: 89,
        protein: '1.1g',
        carbs: '23g',
        fiber: '2.6g',
        potassium: '358mg',
        vitaminC: '8.7mg',
      },
      isActive: true,
      isFeatured: true,
      seoTitle: 'Banano Cavendish Premium Ecuador - Exportación',
      seoDescription: 'Banano premium certificado de Ecuador, líder mundial en exportación',
    },
  });

  // CACAO - Ecuador's fine aroma cacao
  await prisma.product.upsert({
    where: { slug: 'cacao-fino-aroma' },
    update: {},
    create: {
      name: 'Cacao Fino de Aroma Nacional',
      slug: 'cacao-fino-aroma',
      code: 'AGR-CAC-001', // Agricultural - Cacao code
      categoryId: agricolasCategory.id,
      measureId: container40ft.id, // Agricultural products default to 40ft containers
      description:
        'Cacao Nacional ecuatoriano de fino aroma, reconocido mundialmente por su calidad superior para chocolate premium. Ecuador es líder en la exportación de cacao fino.',
      shortDescription: 'Cacao Nacional de aroma fino para chocolate premium',
      sku: 'CAC-NAL-001',
      specifications: {
        variety: 'Nacional Trinitario',
        fermentation: '5-7 días',
        humidity: 'Máximo 7%',
        grading: 'Superior 85%',
        packaging: 'Sacos de jute 60kg',
        containerCapacity: '15-16 toneladas por contenedor 40ft',
        features: [
          'Variedad: Nacional Trinitario',
          'Fermentación: 5-7 días',
          'Humedad: Máximo 7%',
          'Grano superior: 85% mínimo',
          'Aroma floral y frutal característico',
          'Capacidad: ~15,000kg por contenedor 40ft',
        ],
      },
      stockQuantity: 50, // containers available
      minOrderQty: 1, // minimum 1 container
      imageUrl: '/assets/images/products/cacao-nacional.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Enero - Mayo, Octubre - Diciembre',
      certifications: ['Orgánico', 'Comercio Justo', 'Rainforest Alliance', 'UTZ'],
      nutritionalInfo: {
        calories: 228,
        protein: '19.6g',
        carbs: '13.9g',
        fat: '13.7g',
        fiber: '37g',
      },
      isActive: true,
      isFeatured: true,
    },
  });

  // CAMARÓN - Ecuador's leading marine export
  await prisma.product.upsert({
    where: { slug: 'camaron-blanco-premium' },
    update: {},
    create: {
      name: 'Camarón Blanco Premium',
      slug: 'camaron-blanco-premium',
      code: 'MAR-CAM-001', // Marine - Camarón code
      categoryId: marinosCategory.id,
      measureId: pieces.id,
      description:
        'Camarón blanco Litopenaeus vannamei de granjas acuícolas ecuatorianas. Ecuador es líder mundial en exportación de camarón con la más alta calidad y certificaciones internacionales.',
      shortDescription: 'Camarón blanco fresco certificado HACCP y BRC',
      sku: 'CMR-BLC-001',
      specifications: {
        sizes: ['16/20', '21/25', '26/30', '31/40', '41/50', '51/60'],
        presentation: 'Entero, Pelado, Pelado y Desvenado (PUD)',
        packaging: 'Bloques IQF 2kg, Master carton 10kg',
        temperature: '-18°C',
        features: [
          'Especies: Litopenaeus vannamei',
          'Presentaciones: Entero, Pelado, PUD',
          'Congelado IQF (-18°C)',
          'Certificación HACCP, BRC, BAP',
          'Trazabilidad completa',
        ],
      },
      stockQuantity: 5000,
      minOrderQty: 100,
      imageUrl: '/assets/images/products/camaron-blanco.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['HACCP', 'BRC', 'GlobalGAP', 'BAP', 'ASC'],
      nutritionalInfo: {
        calories: 85,
        protein: '18g',
        carbs: '0g',
        fat: '1.4g',
        sodium: '111mg',
        omega3: '0.3g',
      },
      isActive: true,
      isFeatured: true,
    },
  });

  // FLORES - Ecuador's rose exports
  await prisma.product.upsert({
    where: { slug: 'rosas-rojas-premium' },
    update: {},
    create: {
      name: 'Rosas Rojas Premium',
      slug: 'rosas-rojas-premium',
      code: 'AGR-FLO-001', // Agricultural - Flores code
      categoryId: agricolasCategory.id,
      measureId: container40ft.id, // Agricultural products default to 40ft containers
      description:
        'Rosas rojas ecuatorianas de exportación cultivadas en la sierra ecuatoriana. Ecuador es uno de los principales exportadores mundiales de flores, especialmente rosas de alta calidad.',
      shortDescription: 'Rosas premium cultivadas en altura con certificación MPS',
      sku: 'ROS-ROJ-001',
      specifications: {
        variety: 'Red Naomi, Explorer, Freedom',
        length: '50-70cm',
        heads: '4.5-7cm',
        cultivation: 'Greenhouse hydroponic',
        packaging: 'Bunches of 25 stems',
        features: [
          'Variedades: Red Naomi, Explorer, Freedom',
          'Longitud: 50-70cm',
          'Cabeza: 4.5-7cm diámetro',
          'Cultivo hidropónico en invernadero',
          'Vida en florero: 12-15 días',
        ],
      },
      stockQuantity: 50000,
      minOrderQty: 500,
      imageUrl: '/assets/images/products/rosas-rojas.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['MPS', 'Rainforest Alliance', 'GlobalGAP', 'Flowerabel'],
      isActive: true,
      isFeatured: true,
    },
  });

  // LARVAS DE CAMARÓN - Ecuador's aquaculture specialty, moved to marine category
  await prisma.product.upsert({
    where: { slug: 'larvas-camaron-postlarva' },
    update: {},
    create: {
      name: 'Larvas de Camarón Post-Larva',
      slug: 'larvas-camaron-postlarva',
      code: 'MAR-LAR-001', // Marine - Larvas code
      categoryId: marinosCategory.id, // Now correctly categorized under marine products
      measureId: pieces.id,
      description:
        'Larvas de camarón libres de patógenos producidas en laboratorio certificado con tecnología de punta para acuicultura sustentable y desarrollo del sector camaronero ecuatoriano.',
      shortDescription: 'Larvas de camarón certificadas para acuicultura',
      sku: 'LAR-CAM-001',
      specifications: {
        species: 'Litopenaeus vannamei',
        stage: 'Post-larva PL10-PL15',
        density: '100,000-300,000 por caja',
        survival: '85% mínimo',
        packaging: 'Bolsas oxigenadas transportables',
        features: [
          'Especies: Litopenaeus vannamei',
          'Estadio: Post-larva PL10-PL15',
          'Libres de patógenos específicos',
          'Control genético y sanitario',
          'Asesoría técnica incluida',
        ],
      },
      stockQuantity: 1000000,
      minOrderQty: 100000,
      imageUrl: '/assets/images/products/larvas-camaron.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['SENASA', 'OIRSA', 'Laboratorio Certificado', 'SPF'],
      isActive: true,
      isFeatured: true,
    },
  });

  // AGUACATE HASS - Premium export avocado
  await prisma.product.upsert({
    where: { slug: 'aguacate-hass-premium' },
    update: {},
    create: {
      name: 'Aguacate Hass Premium',
      slug: 'aguacate-hass-premium',
      code: 'AGR-AGU-001', // Agricultural - Aguacate code
      categoryId: agricolasCategory.id,
      measureId: container40ft.id, // Agricultural products default to 40ft containers
      description:
        'Aguacate Hass de calidad exportación cultivado en Ecuador. Textura cremosa, sabor intenso y certificación orgánica disponible.',
      shortDescription: 'Aguacate Hass premium export quality',
      sku: 'AGU-HAS-001',
      specifications: {
        weight: '180-300g',
        size: '70-85mm',
        maturity: '21-26% aceite',
        harvest: 'Todo el año',
        packaging: 'Cajas de 4kg (14-18 unidades)',
        features: [
          'Peso: 180-300g por unidad',
          'Calibre: 70-85mm',
          'Contenido de aceite: 21-26%',
          'Vida útil: 7-14 días',
          'Certificación orgánica disponible',
        ],
      },
      stockQuantity: 4000,
      minOrderQty: 500,
      imageUrl: '/assets/images/products/aguacate-hass.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'HACCP', 'Orgánico', 'Rainforest Alliance'],
      nutritionalInfo: {
        calories: 160,
        protein: '2g',
        carbs: '9g',
        fiber: '7g',
        fat: '15g',
        potassium: '485mg',
      },
      isActive: true,
      isFeatured: true,
    },
  });

  // MANGO PREMIUM - Tommy Atkins variety
  await prisma.product.upsert({
    where: { slug: 'mango-tommy-atkins' },
    update: {},
    create: {
      name: 'Mango Tommy Atkins Premium',
      slug: 'mango-tommy-atkins',
      code: 'AGR-MAN-001', // Agricultural - Mango code
      categoryId: agricolasCategory.id,
      measureId: container40ft.id, // Agricultural products default to 40ft containers
      description:
        'Mango Tommy Atkins de exportación premium cultivado en la costa ecuatoriana. Frutos grandes, dulces y con excelente vida útil postcosecha.',
      shortDescription: 'Mango premium Tommy Atkins export quality',
      sku: 'MAN-TOM-001',
      specifications: {
        weight: '350-600g',
        size: '10-15cm',
        brix: '12-16°',
        harvest: 'Noviembre - Marzo',
        packaging: 'Cajas de 4kg (8-12 unidades)',
        features: [
          'Variedad: Tommy Atkins',
          'Peso: 350-600g por unidad',
          'Brix: 12-16 grados',
          'Vida útil: 15-21 días',
          'Resistente al transporte',
        ],
      },
      stockQuantity: 6000,
      minOrderQty: 1000,
      imageUrl: '/assets/images/products/mango-tommy.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Noviembre - Marzo',
      certifications: ['GlobalGAP', 'HACCP', 'Orgánico', 'SENASA'],
      nutritionalInfo: {
        calories: 60,
        protein: '0.8g',
        carbs: '15g',
        fiber: '1.6g',
        vitaminC: '36.4mg',
        vitaminA: '54mcg',
      },
      isActive: true,
      isFeatured: true,
    },
  });

  // CAFÉ ARÁBICA - Highland coffee from Ecuador
  await prisma.product.upsert({
    where: { slug: 'cafe-arabica-altura' },
    update: {},
    create: {
      name: 'Café Arábica de Altura Premium',
      slug: 'cafe-arabica-altura',
      code: 'AGR-CAF-001', // Agricultural - Café code
      categoryId: agricolasCategory.id,
      measureId: container40ft.id, // Agricultural products default to 40ft containers
      description:
        'Granos de café cultivados en las montañas andinas ecuatorianas entre 1200-1800 msnm, reconocidos mundialmente por su calidad excepcional y perfil único.',
      shortDescription: 'Café arábica de altura 100% premium',
      sku: 'CAF-ARA-001',
      specifications: {
        altitude: '1200-1800 msnm',
        process: 'Lavado',
        roast: 'Grano verde',
        cupping: '84+ puntos SCA',
        packaging: 'Sacos de yute 69kg',
        features: [
          'Altitud: 1200-1800 msnm',
          'Proceso: Lavado',
          'Microclimas únicos',
          'Perfil: Cítrico y floral',
          'Comercio justo certificado',
        ],
      },
      stockQuantity: 2000,
      minOrderQty: 100,
      imageUrl: '/assets/images/products/cafe-arabica.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Abril - Agosto',
      certifications: ['Orgánico', 'Comercio Justo', 'Rainforest Alliance', 'SCA'],
      isActive: true,
      isFeatured: true,
    },
  });

  // ATÚN FRESCO - Fresh Pacific tuna
  await prisma.product.upsert({
    where: { slug: 'atun-fresco-pacifico' },
    update: {},
    create: {
      name: 'Atún Fresco del Pacífico',
      slug: 'atun-fresco-pacifico',
      code: 'MAR-ATU-001', // Marine - Atún code
      categoryId: marinosCategory.id,
      measureId: pieces.id, // Marine products default to pieces
      description:
        'Atún fresco capturado en las ricas aguas del Pacífico ecuatoriano con técnicas sustentables. Procesamiento inmediato post-captura.',
      shortDescription: 'Atún fresco captura sustentable',
      sku: 'ATU-FRE-001',
      specifications: {
        species: 'Thunnus albacares (Yellowfin)',
        weight: '15-80kg por pieza',
        temperature: '0-2°C',
        processing: 'Inmediato post-captura',
        packaging: 'Cajas isotérmicas',
        features: [
          'Especie: Atún aleta amarilla',
          'Captura sustentable MSC',
          'Procesamiento en barco',
          'Cadena de frío garantizada',
          'Trazabilidad completa',
        ],
      },
      stockQuantity: 1500,
      minOrderQty: 50,
      imageUrl: '/assets/images/products/atun-fresco.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['MSC', 'HACCP', 'BRC', 'IUU-free'],
      nutritionalInfo: {
        calories: 144,
        protein: '23g',
        fat: '5g',
        omega3: '1.3g',
        iron: '1.0mg',
      },
      isActive: true,
      isFeatured: false,
    },
  });

  // CALABAZA PREMIUM - Premium pumpkin
  await prisma.product.upsert({
    where: { slug: 'calabaza-premium' },
    update: {},
    create: {
      name: 'Calabaza Premium',
      slug: 'calabaza-premium',
      code: 'AGR-CAL-001', // Agricultural - Calabaza code
      categoryId: agricolasCategory.id,
      description:
        'Calabaza premium cultivada con métodos orgánicos en Ecuador. Rica en nutrientes y perfecta para exportación.',
      shortDescription: 'Calabaza orgánica premium',
      sku: 'CAL-PRE-001',
      specifications: {
        weight: '2-5kg',
        variety: 'Butternut, Kabocha',
        harvest: 'Junio - Diciembre',
        packaging: 'Cajas de 10kg',
        features: ['Cultivo orgánico', 'Rica en nutrientes', 'Vida útil extendida'],
      },
      stockQuantity: 2000,
      minOrderQty: 200,
      imageUrl: '/assets/images/products/calabaza-premium.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Junio - Diciembre',
      certifications: ['Orgánico', 'GlobalGAP'],
      isActive: true,
      isFeatured: false,
    },
  });

  // CAMOTE DULCE - Sweet potato
  await prisma.product.upsert({
    where: { slug: 'camote-dulce' },
    update: {},
    create: {
      name: 'Camote Dulce',
      slug: 'camote-dulce',
      code: 'AGR-CAM-002', // Agricultural - Camote code
      categoryId: agricolasCategory.id,
      description:
        'Camote dulce ecuatoriano rico en nutrientes y vitaminas. Cultivo sustentable en la costa.',
      shortDescription: 'Camote dulce rico en nutrientes',
      sku: 'CAM-DUL-001',
      specifications: {
        weight: '150-400g',
        variety: 'Orange flesh, Purple',
        harvest: 'Todo el año',
        packaging: 'Cajas de 15kg',
        features: ['Rico en vitamina A', 'Antioxidantes naturales', 'Fibra alta'],
      },
      stockQuantity: 3000,
      minOrderQty: 300,
      imageUrl: '/assets/images/products/camote-dulce.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'HACCP'],
      isActive: true,
      isFeatured: false,
    },
  });

  // CAÑA DE AZÚCAR - Sugar cane
  await prisma.product.upsert({
    where: { slug: 'cana-azucar' },
    update: {},
    create: {
      name: 'Caña de Azúcar',
      slug: 'cana-azucar',
      code: 'AGR-CAN-001', // Agricultural - Caña code
      categoryId: agricolasCategory.id,
      description:
        'Caña de azúcar ecuatoriana para procesamiento natural. Cultivo sustentable en la costa.',
      shortDescription: 'Caña de azúcar procesamiento natural',
      sku: 'CAN-AZU-001',
      specifications: {
        length: '2-3m',
        brix: '18-22°',
        harvest: 'Mayo - Noviembre',
        packaging: 'Atados de 25kg',
        features: ['Alto contenido de sacarosa', 'Procesamiento natural', 'Fibra aprovechable'],
      },
      stockQuantity: 5000,
      minOrderQty: 1000,
      imageUrl: '/assets/images/products/cana-azucar.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Mayo - Noviembre',
      certifications: ['GlobalGAP', 'Orgánico'],
      isActive: true,
      isFeatured: false,
    },
  });

  // CEBOLLA PREMIUM - Premium onion
  await prisma.product.upsert({
    where: { slug: 'cebolla-premium' },
    update: {},
    create: {
      name: 'Cebolla Premium',
      slug: 'cebolla-premium',
      code: 'AGR-CEB-001', // Agricultural - Cebolla code
      categoryId: agricolasCategory.id,
      description:
        'Cebolla premium de variedades selectas cultivada en Ecuador. Sabor intenso y larga conservación.',
      shortDescription: 'Cebolla variedades selectas',
      sku: 'CEB-PRE-001',
      specifications: {
        size: '60-80mm',
        variety: 'Red, Yellow, White',
        harvest: 'Junio - Octubre',
        packaging: 'Sacos de 25kg',
        features: ['Variedades selectas', 'Sabor intenso', 'Larga conservación'],
      },
      stockQuantity: 4000,
      minOrderQty: 500,
      imageUrl: '/assets/images/products/cebolla-premium.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Junio - Octubre',
      certifications: ['GlobalGAP', 'HACCP'],
      isActive: true,
      isFeatured: false,
    },
  });

  // CHAYOTE ORGÁNICO - Organic chayote
  await prisma.product.upsert({
    where: { slug: 'chayote-organico' },
    update: {},
    create: {
      name: 'Chayote Orgánico',
      slug: 'chayote-organico',
      code: 'AGR-CHA-001', // Agricultural - Chayote code
      categoryId: agricolasCategory.id,
      description:
        'Chayote orgánico certificado internacionalmente. Bajo en calorías y rico en nutrientes.',
      shortDescription: 'Chayote certificado internacional',
      sku: 'CHA-ORG-001',
      specifications: {
        weight: '200-500g',
        variety: 'Verde claro, Verde oscuro',
        harvest: 'Todo el año',
        packaging: 'Cajas de 12kg',
        features: ['Certificación orgánica', 'Bajo en calorías', 'Rico en vitamina C'],
      },
      stockQuantity: 2500,
      minOrderQty: 250,
      imageUrl: '/assets/images/products/chayote-organico.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['Orgánico', 'GlobalGAP', 'HACCP'],
      isActive: true,
      isFeatured: false,
    },
  });

  // COCO TROPICAL - Tropical coconut
  await prisma.product.upsert({
    where: { slug: 'coco-tropical' },
    update: {},
    create: {
      name: 'Coco Tropical',
      slug: 'coco-tropical',
      code: 'AGR-COC-001', // Agricultural - Coco code
      categoryId: agricolasCategory.id,
      description: 'Coco tropical de la costa ecuatoriana. Agua de coco natural y pulpa fresca.',
      shortDescription: 'Coco costa ecuatoriana',
      sku: 'COC-TRO-001',
      specifications: {
        weight: '800-1500g',
        variety: 'Malayo Enano, Gigante',
        harvest: 'Todo el año',
        packaging: 'Cajas de 15 unidades',
        features: ['Agua natural', 'Pulpa fresca', 'Rico en electrolitos'],
      },
      stockQuantity: 3000,
      minOrderQty: 100,
      imageUrl: '/assets/images/products/coco-tropical.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'HACCP'],
      isActive: true,
      isFeatured: false,
    },
  });

  // CÚRCUMA - Turmeric
  await prisma.product.upsert({
    where: { slug: 'curcuma' },
    update: {},
    create: {
      name: 'Cúrcuma',
      slug: 'curcuma',
      code: 'AGR-CUR-001', // Agricultural - Cúrcuma code
      categoryId: agricolasCategory.id,
      description:
        'Cúrcuma ecuatoriana con propiedades medicinales. Rica en curcumina y antioxidantes.',
      shortDescription: 'Cúrcuma propiedades medicinales',
      sku: 'CUR-CUM-001',
      specifications: {
        form: 'Fresca, Seca en polvo',
        curcumin: '3-5%',
        harvest: 'Agosto - Diciembre',
        packaging: 'Cajas de 5kg',
        features: ['Rica en curcumina', 'Propiedades antiinflamatorias', 'Antioxidante natural'],
      },
      stockQuantity: 1000,
      minOrderQty: 50,
      imageUrl: '/assets/images/products/curcuma.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Agosto - Diciembre',
      certifications: ['Orgánico', 'GlobalGAP'],
      isActive: true,
      isFeatured: false,
    },
  });

  // JENGIBRE FRESCO - Fresh ginger
  await prisma.product.upsert({
    where: { slug: 'jengibre-fresco' },
    update: {},
    create: {
      name: 'Jengibre Fresco',
      slug: 'jengibre-fresco',
      code: 'AGR-JEN-001', // Agricultural - Jengibre code
      categoryId: agricolasCategory.id,
      description:
        'Jengibre fresco de calidad exportación. Sabor intenso y propiedades medicinales.',
      shortDescription: 'Jengibre calidad exportación',
      sku: 'JEN-FRE-001',
      specifications: {
        form: 'Rizoma fresco',
        moisture: '80-85%',
        harvest: 'Septiembre - Enero',
        packaging: 'Cajas de 10kg',
        features: ['Sabor intenso', 'Propiedades digestivas', 'Antiinflamatorio natural'],
      },
      stockQuantity: 1500,
      minOrderQty: 100,
      imageUrl: '/assets/images/products/jengibre-fresco.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Septiembre - Enero',
      certifications: ['GlobalGAP', 'HACCP', 'Orgánico'],
      isActive: true,
      isFeatured: false,
    },
  });

  // Continue with more products...

  // ÑAME TROPICAL - Tropical yam
  await prisma.product.upsert({
    where: { slug: 'name-tropical' },
    update: {},
    create: {
      name: 'Ñame Tropical',
      slug: 'name-tropical',
      code: 'AGR-NAM-001', // Agricultural - Ñame code
      categoryId: agricolasCategory.id,
      description:
        'Ñame tropical de variedades autóctonas ecuatorianas. Tubérculo nutritivo y versátil.',
      shortDescription: 'Ñame variedades autóctonas',
      sku: 'NAM-TRO-001',
      specifications: {
        weight: '500-2000g',
        variety: 'Blanco, Morado',
        harvest: 'Julio - Noviembre',
        packaging: 'Sacos de 20kg',
        features: ['Variedades autóctonas', 'Alto contenido nutricional', 'Versátil en cocina'],
      },
      stockQuantity: 2000,
      minOrderQty: 200,
      imageUrl: '/assets/images/products/name-tropical.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Julio - Noviembre',
      certifications: ['GlobalGAP', 'HACCP'],
      isActive: true,
      isFeatured: false,
    },
  });

  // ÑAMPÍ - Andean tuber
  await prisma.product.upsert({
    where: { slug: 'nampi' },
    update: {},
    create: {
      name: 'Ñampí',
      slug: 'nampi',
      code: 'AGR-NPI-001', // Agricultural - Ñampí code
      categoryId: agricolasCategory.id,
      description: 'Ñampí, tubérculo andino tradicional ecuatoriano. Rico en almidón y minerales.',
      shortDescription: 'Ñampí tubérculo andino',
      sku: 'NAM-PI-001',
      specifications: {
        weight: '300-800g',
        variety: 'Tradicional andino',
        harvest: 'Junio - Octubre',
        packaging: 'Sacos de 18kg',
        features: ['Tubérculo andino', 'Rico en almidón', 'Tradicional ecuatoriano'],
      },
      stockQuantity: 1500,
      minOrderQty: 150,
      imageUrl: '/assets/images/products/nampi.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Junio - Octubre',
      certifications: ['GlobalGAP', 'Orgánico'],
      isActive: true,
      isFeatured: false,
    },
  });

  // PALMITO ORGÁNICO - Organic palm heart
  await prisma.product.upsert({
    where: { slug: 'palmito-organico' },
    update: {},
    create: {
      name: 'Palmito Orgánico',
      slug: 'palmito-organico',
      code: 'AGR-PAL-001', // Agricultural - Palmito code
      categoryId: agricolasCategory.id,
      description:
        'Palmito orgánico sustentable certificado. Cosecha responsable de palma de pejibaye.',
      shortDescription: 'Palmito sustentable certificado',
      sku: 'PAL-ORG-001',
      specifications: {
        diameter: '2-4cm',
        length: '15-20cm',
        harvest: 'Todo el año',
        packaging: 'Frascos de vidrio 450g',
        features: ['Cultivo sustentable', 'Certificación orgánica', 'Cosecha responsable'],
      },
      stockQuantity: 800,
      minOrderQty: 50,
      imageUrl: '/assets/images/products/palmito-organico.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['Orgánico', 'Rainforest Alliance', 'FSC'],
      isActive: true,
      isFeatured: false,
    },
  });

  // PAPAYA HAWAIANA - Hawaiian papaya
  await prisma.product.upsert({
    where: { slug: 'papaya-hawaiana' },
    update: {},
    create: {
      name: 'Papaya Hawaiana',
      slug: 'papaya-hawaiana',
      code: 'AGR-PAP-001', // Agricultural - Papaya code
      categoryId: agricolasCategory.id,
      description:
        'Papaya hawaiana de dulzura natural cultivada en Ecuador. Rica en enzimas digestivas.',
      shortDescription: 'Papaya dulzura natural',
      sku: 'PAP-HAW-001',
      specifications: {
        weight: '800-2500g',
        brix: '11-13°',
        harvest: 'Todo el año',
        packaging: 'Cajas de 12kg',
        features: ['Dulzura natural', 'Rica en papaína', 'Enzimas digestivas'],
      },
      stockQuantity: 3000,
      minOrderQty: 300,
      imageUrl: '/assets/images/products/papaya-hawaiana.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'HACCP', 'Orgánico'],
      isActive: true,
      isFeatured: false,
    },
  });

  // PIÑA GOLDEN - Golden pineapple MD2
  await prisma.product.upsert({
    where: { slug: 'pina-golden' },
    update: {},
    create: {
      name: 'Piña Golden MD2',
      slug: 'pina-golden',
      code: 'AGR-PIN-001', // Agricultural - Piña code
      categoryId: agricolasCategory.id,
      description:
        'Piña Golden MD2 de máxima calidad cultivada en Ecuador. Dulzura excepcional y bajo contenido ácido.',
      shortDescription: 'Piña MD2 máxima calidad',
      sku: 'PIN-GOL-001',
      specifications: {
        weight: '1200-2500g',
        brix: '15-18°',
        variety: 'MD2 Golden',
        harvest: 'Todo el año',
        packaging: 'Cajas de 12kg',
        features: ['Variedad MD2', 'Dulzura excepcional', 'Bajo contenido ácido'],
      },
      stockQuantity: 4000,
      minOrderQty: 400,
      imageUrl: '/assets/images/products/pina-golden.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'HACCP', 'Rainforest Alliance'],
      isActive: true,
      isFeatured: false,
    },
  });

  // PLÁTANO VERDE - Green plantain
  await prisma.product.upsert({
    where: { slug: 'platano-verde' },
    update: {},
    create: {
      name: 'Plátano Verde',
      slug: 'platano-verde',
      code: 'AGR-PLA-001', // Agricultural - Plátano code
      categoryId: agricolasCategory.id,
      description:
        'Plátano verde ecuatoriano para exportación. Ideal para procesamiento industrial y consumo.',
      shortDescription: 'Plátano verde para exportación',
      sku: 'PLA-VER-001',
      specifications: {
        weight: '200-400g',
        length: '20-25cm',
        harvest: 'Todo el año',
        packaging: 'Cajas de 18kg',
        features: ['Para exportación', 'Procesamiento industrial', 'Rico en almidón'],
      },
      stockQuantity: 8000,
      minOrderQty: 1000,
      imageUrl: '/assets/images/products/platano-verde.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'HACCP', 'Rainforest Alliance'],
      isActive: true,
      isFeatured: false,
    },
  });

  // YUCA PREMIUM - Premium cassava
  await prisma.product.upsert({
    where: { slug: 'yuca-premium' },
    update: {},
    create: {
      name: 'Yuca Premium',
      slug: 'yuca-premium',
      code: 'AGR-YUC-001', // Agricultural - Yuca code
      categoryId: agricolasCategory.id,
      description: 'Yuca premium para procesamiento industrial. Tubérculo versátil y nutritivo.',
      shortDescription: 'Yuca procesamiento industrial',
      sku: 'YUC-PRE-001',
      specifications: {
        length: '20-40cm',
        diameter: '3-8cm',
        harvest: 'Todo el año',
        packaging: 'Sacos de 25kg',
        features: ['Procesamiento industrial', 'Alto contenido de almidón', 'Versátil uso'],
      },
      stockQuantity: 6000,
      minOrderQty: 1000,
      imageUrl: '/assets/images/products/yuca-premium.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['GlobalGAP', 'HACCP'],
      isActive: true,
      isFeatured: false,
    },
  });

  // ÁRBOLES DE MANGO - Mango trees
  await prisma.product.upsert({
    where: { slug: 'arboles-mango' },
    update: {},
    create: {
      name: 'Árboles de Mango',
      slug: 'arboles-mango',
      code: 'OTR-ARB-001', // Other Products - Árboles code
      categoryId: otrosCategory.id,
      description:
        'Árboles de mango de variedades tropicales para cultivo. Plantas certificadas y adaptadas.',
      shortDescription: 'Árboles mango variedades tropicales',
      sku: 'ARB-MAN-001',
      specifications: {
        height: '50-80cm',
        varieties: 'Tommy Atkins, Kent, Keitt',
        age: '6-12 meses',
        packaging: 'Bolsas individuales',
        features: ['Variedades tropicales', 'Plantas certificadas', 'Adaptadas al clima'],
      },
      stockQuantity: 500,
      minOrderQty: 50,
      imageUrl: '/assets/images/products/arboles-mango.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['SENASA', 'Fitosanitario'],
      isActive: true,
      isFeatured: false,
    },
  });

  // ÁRBOLES DE AGUACATE - Avocado trees
  await prisma.product.upsert({
    where: { slug: 'arboles-aguacate' },
    update: {},
    create: {
      name: 'Árboles de Aguacate',
      slug: 'arboles-aguacate',
      code: 'OTR-AGU-001', // Other Products - Aguacate trees code
      categoryId: otrosCategory.id,
      description:
        'Árboles de aguacate Hass y criollos para cultivo comercial. Plantas injertadas certificadas.',
      shortDescription: 'Árboles aguacate Hass y criollos',
      sku: 'ARB-AGU-001',
      specifications: {
        height: '60-100cm',
        varieties: 'Hass, Fuerte, Criollo',
        age: '8-18 meses',
        packaging: 'Contenedores individuales',
        features: ['Plantas injertadas', 'Certificación fitosanitaria', 'Variedades comerciales'],
      },
      stockQuantity: 400,
      minOrderQty: 25,
      imageUrl: '/assets/images/products/arboles-aguacate.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['SENASA', 'Fitosanitario'],
      isActive: true,
      isFeatured: false,
    },
  });

  // ÁRBOLES CÍTRICOS - Citrus trees
  await prisma.product.upsert({
    where: { slug: 'arboles-citricos' },
    update: {},
    create: {
      name: 'Árboles Cítricos',
      slug: 'arboles-citricos',
      code: 'OTR-CIT-001', // Other Products - Cítricos code
      categoryId: otrosCategory.id,
      description:
        'Árboles cítricos: naranja, limón, mandarina para cultivo comercial. Variedades adaptadas.',
      shortDescription: 'Árboles naranja, limón, mandarina',
      sku: 'ARB-CIT-001',
      specifications: {
        height: '50-80cm',
        varieties: 'Naranja Valencia, Limón Tahití, Mandarina',
        age: '6-15 meses',
        packaging: 'Bolsas individuales',
        features: ['Variedades comerciales', 'Adaptadas al trópico', 'Certificación sanitaria'],
      },
      stockQuantity: 600,
      minOrderQty: 50,
      imageUrl: '/assets/images/products/arboles-citricos.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Todo el año',
      certifications: ['SENASA', 'Fitosanitario'],
      isActive: true,
      isFeatured: false,
    },
  });

  // NUECES DE MACADAMIA - Macadamia nuts
  await prisma.product.upsert({
    where: { slug: 'nueces-macadamia' },
    update: {},
    create: {
      name: 'Nueces de Macadamia',
      slug: 'nueces-macadamia',
      code: 'OTR-MAC-001', // Other Products - Macadamia code
      categoryId: otrosCategory.id,
      description:
        'Nueces de macadamia de cultivo especializado en Ecuador. Premium quality con certificación.',
      shortDescription: 'Nueces macadamia cultivo especializado',
      sku: 'NUE-MAC-001',
      specifications: {
        size: '18-22mm',
        moisture: '1.5% máximo',
        harvest: 'Marzo - Agosto',
        packaging: 'Bolsas vacuum 5kg',
        features: ['Cultivo especializado', 'Premium quality', 'Procesamiento artesanal'],
      },
      stockQuantity: 300,
      minOrderQty: 20,
      imageUrl: '/assets/images/products/nueces-macadamia.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Marzo - Agosto',
      certifications: ['Orgánico', 'GlobalGAP'],
      isActive: true,
      isFeatured: false,
    },
  });

  // NUECES PECANAS - Pecan nuts
  await prisma.product.upsert({
    where: { slug: 'nueces-pecanas' },
    update: {},
    create: {
      name: 'Nueces Pecanas',
      slug: 'nueces-pecanas',
      code: 'OTR-PEC-001', // Other Products - Pecanas code
      categoryId: otrosCategory.id,
      description:
        'Nueces pecanas adaptadas al trópico ecuatoriano. Cultivo innovador con técnicas especializadas.',
      shortDescription: 'Nueces pecanas adaptadas al trópico',
      sku: 'NUE-PEC-001',
      specifications: {
        size: '15-20mm',
        moisture: '3% máximo',
        harvest: 'Abril - Septiembre',
        packaging: 'Bolsas vacuum 5kg',
        features: ['Adaptadas al trópico', 'Cultivo innovador', 'Técnicas especializadas'],
      },
      stockQuantity: 200,
      minOrderQty: 15,
      imageUrl: '/assets/images/products/nueces-pecanas.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Abril - Septiembre',
      certifications: ['Orgánico', 'GlobalGAP'],
      isActive: true,
      isFeatured: false,
    },
  });

  // ALMENDRAS TROPICALES - Tropical almonds
  await prisma.product.upsert({
    where: { slug: 'almendras-tropicales' },
    update: {},
    create: {
      name: 'Almendras Tropicales',
      slug: 'almendras-tropicales',
      code: 'OTR-ALM-001', // Other Products - Almendras code
      categoryId: otrosCategory.id,
      description:
        'Almendras tropicales de variedades ecuatorianas. Cultivo tradicional con métodos modernos.',
      shortDescription: 'Almendras variedades ecuatorianas',
      sku: 'ALM-TRO-001',
      specifications: {
        size: '12-18mm',
        moisture: '4% máximo',
        harvest: 'Febrero - Julio',
        packaging: 'Bolsas vacuum 5kg',
        features: ['Variedades ecuatorianas', 'Cultivo tradicional', 'Métodos modernos'],
      },
      stockQuantity: 400,
      minOrderQty: 25,
      imageUrl: '/assets/images/products/almendras-tropicales.jpg',
      origin: 'Ecuador',
      harvestSeason: 'Febrero - Julio',
      certifications: ['Orgánico', 'GlobalGAP'],
      isActive: true,
      isFeatured: false,
    },
  });

  console.log('✅ Comprehensive Ecuadorian export database seeded successfully!');
  console.log('📊 Created:');
  console.log(
    '  - 3 Ecuadorian export categories: Agrícolas, Marinos y de la Pesca, Otros Productos'
  );
  console.log('  - 26 premium export products: Complete catalog matching page.tsx products');
  console.log('  - 2 admin users with contact details');
  console.log(
    '  - All products include detailed specifications, certifications, and export standards'
  );
  console.log("  - Categories reflect Ecuador's main export industries and products");
  console.log('  - Larvas de Camarón correctly categorized under Marinos y de la Pesca');
  console.log('  - All products from static page now available in database');

  // =====================================================
  // INTERNATIONALIZATION (i18n) SEEDING
  // =====================================================
  console.log('🌐 Creating languages...');

  const spanishLang = await prisma.language.upsert({
    where: { code: 'es' },
    update: {},
    create: {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      isActive: true,
      isDefault: true,
      sortOrder: 1,
    },
  });

  const englishLang = await prisma.language.upsert({
    where: { code: 'en' },
    update: {},
    create: {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      isActive: true,
      isDefault: false,
      sortOrder: 2,
    },
  });

  console.log('📝 Creating category translations...');

  // Category translations - English versions
  const categoryTranslations = [
    {
      slug: 'agricolas',
      en: {
        name: 'Agricultural Products',
        description:
          "Banana: Ecuador is one of the largest exporters of bananas worldwide. Cocoa: The country is a major exporter of fine aroma cocoa, used in premium chocolate production. Flowers: Ecuador is a major flower producer, especially roses, and is one of the world's leading exporters. Coffee: The country grows various coffee varieties, exporting aromatic and highly demanded products. Other fruits: Other fruits such as pineapple, broccoli, and fruit juices and preserves are also exported.",
      },
    },
    {
      slug: 'marinos-y-pesca',
      en: {
        name: 'Marine and Fishing Products',
        description:
          'Shrimp: Ecuador is a world leader in crustacean exports, mainly shrimp and prawns. Fish: Fish exports include tuna, as well as processed and canned products.',
      },
    },
    {
      slug: 'otros-productos',
      en: {
        name: 'Other Products',
        description:
          'Manufactures: Some manufactures are exported, such as metal products and banana derivatives. Wood: Wood is another export product of the country. Oils and fats: Products such as palm oil and fish oils are also included.',
      },
    },
  ];

  for (const catTrans of categoryTranslations) {
    const category = await prisma.category.findUnique({ where: { slug: catTrans.slug } });
    if (category) {
      // Spanish translation (original data)
      await prisma.categoryTranslation.upsert({
        where: { categoryId_languageId: { categoryId: category.id, languageId: spanishLang.id } },
        update: {},
        create: {
          categoryId: category.id,
          languageId: spanishLang.id,
          name: category.name,
          description: category.description,
        },
      });

      // English translation
      await prisma.categoryTranslation.upsert({
        where: { categoryId_languageId: { categoryId: category.id, languageId: englishLang.id } },
        update: {},
        create: {
          categoryId: category.id,
          languageId: englishLang.id,
          name: catTrans.en.name,
          description: catTrans.en.description,
        },
      });
    }
  }

  console.log('📝 Creating product translations...');

  // Product translations - English versions
  const productTranslations = [
    {
      slug: 'banano-cavendish-premium',
      en: {
        name: 'Premium Cavendish Banana',
        description:
          "Premium export Cavendish banana grown on the Ecuadorian coast. Ecuador is one of the world's largest banana exporters with excellent quality and shelf life.",
        shortDescription: 'Premium export banana with international certification',
      },
    },
    {
      slug: 'cacao-fino-aroma',
      en: {
        name: 'Fine Aroma National Cocoa',
        description:
          'Ecuadorian Nacional fine aroma cocoa, recognized worldwide for its superior quality for premium chocolate. Ecuador is a leader in fine cocoa exports.',
        shortDescription: 'National fine aroma cocoa for premium chocolate',
      },
    },
    {
      slug: 'camaron-blanco-premium',
      en: {
        name: 'Premium White Shrimp',
        description:
          'Litopenaeus vannamei white shrimp from Ecuadorian aquaculture farms. Ecuador is a world leader in shrimp exports with the highest quality and international certifications.',
        shortDescription: 'HACCP and BRC certified fresh white shrimp',
      },
    },
    {
      slug: 'cafe-arabica-altura',
      en: {
        name: 'High Altitude Arabica Coffee',
        description:
          "High altitude Arabica coffee grown in Ecuador's Andes mountains. Specialty coffee with notes of chocolate, citrus fruits, and caramel.",
        shortDescription: 'Specialty coffee with unique flavor notes',
      },
    },
    {
      slug: 'brocoli-crown',
      en: {
        name: 'Crown Broccoli',
        description:
          "Fresh broccoli from Ecuador's highlands, grown at high altitude for optimal quality. Tight, compact florets with vibrant green color.",
        shortDescription: 'Fresh highland broccoli IQF',
      },
    },
    {
      slug: 'maracuya-pulpa',
      en: {
        name: 'Passion Fruit Pulp',
        description:
          'Concentrated passion fruit pulp from Ecuador, intense tropical flavor ideal for juices, smoothies, and desserts.',
        shortDescription: 'Frozen concentrated passion fruit',
      },
    },
    {
      slug: 'mango-tommy-atkins',
      en: {
        name: 'Tommy Atkins Mango',
        description:
          "Tommy Atkins mango for export, cultivated on Ecuador's tropical coast. Sweet, juicy pulp with excellent shelf life.",
        shortDescription: 'Export quality tropical mango',
      },
    },
    {
      slug: 'pitahaya-amarilla',
      en: {
        name: 'Yellow Dragon Fruit',
        description:
          "Exotic yellow dragon fruit (pitahaya) from Ecuador, highly valued for its unique flavor and health properties. Ecuador's exclusive export product.",
        shortDescription: 'Exotic Ecuadorian dragon fruit',
      },
    },
    {
      slug: 'langostino-tigre',
      en: {
        name: 'Tiger Prawns',
        description:
          'Giant tiger prawns from Ecuadorian aquaculture, farmed under strict quality standards. Firm flesh with exceptional flavor.',
        shortDescription: 'Premium aquaculture tiger prawns',
      },
    },
    {
      slug: 'tilapia-filetes',
      en: {
        name: 'Tilapia Fillets',
        description:
          'Fresh tilapia fillets from Ecuadorian farms. White, mild-flavored flesh, ideal for diverse culinary preparations.',
        shortDescription: 'Fresh fish fillets IQF',
      },
    },
    {
      slug: 'aceite-palma-refinado',
      en: {
        name: 'Refined Palm Oil',
        description:
          'Refined palm oil from sustainable Ecuadorian plantations. Versatile vegetable oil for food and industrial industry.',
        shortDescription: 'Certified sustainable palm oil',
      },
    },
    {
      slug: 'teca-madera-aserrada',
      en: {
        name: 'Teak Lumber',
        description:
          "High quality teak lumber from Ecuador's sustainable plantations. Premium hardwood for furniture, construction, and shipbuilding.",
        shortDescription: 'FSC certified premium hardwood',
      },
    },
    {
      slug: 'balsa-madera',
      en: {
        name: 'Balsa Wood',
        description:
          "Ecuadorian balsa wood, the world's lightest commercial wood. Ecuador supplies over 95% of world balsa production.",
        shortDescription: 'Ultralight wood for specialized uses',
      },
    },
    {
      slug: 'harina-pescado',
      en: {
        name: 'Fish Meal',
        description:
          'High protein fish meal derived from the Ecuadorian fishing industry. Essential ingredient for animal feed and aquaculture.',
        shortDescription: 'High protein feed ingredient',
      },
    },
    {
      slug: 'tagua-marfil-vegetal',
      en: {
        name: 'Vegetable Ivory Tagua',
        description:
          "Tagua or vegetable ivory, an ecological and sustainable alternative to animal ivory. Ecuador is the world's leading producer.",
        shortDescription: 'Ecological ivory alternative',
      },
    },
    {
      slug: 'chips-banano',
      en: {
        name: 'Banana Chips',
        description:
          'Crunchy banana chips made from premium Ecuadorian bananas. Natural healthy snack available in various flavors.',
        shortDescription: 'Crunchy natural banana snack',
      },
    },
    {
      slug: 'palmito-conserva',
      en: {
        name: 'Canned Hearts of Palm',
        description:
          'Hearts of palm from sustainable plantations in Ecuador. Delicate flavor and tender texture, ideal for salads and gourmet dishes.',
        shortDescription: 'Gourmet hearts of palm in brine',
      },
    },
    {
      slug: 'quinua-organica',
      en: {
        name: 'Organic Quinoa',
        description:
          "Organic quinoa grown in Ecuador's highlands. Ancient grain with high protein and essential amino acid content.",
        shortDescription: 'Andean superfood',
      },
    },
    {
      slug: 'uvilla-deshidratada',
      en: {
        name: 'Dried Golden Berries',
        description:
          'Dried golden berries (physalis), Andean fruit rich in antioxidants and vitamins. Natural sweet and sour flavor.',
        shortDescription: 'Andean fruit rich in antioxidants',
      },
    },
    {
      slug: 'naranjilla-pulpa',
      en: {
        name: 'Naranjilla Pulp',
        description:
          'Frozen naranjilla pulp, unique Ecuadorian citrus fruit with a flavor between green tomato and citrus. Ideal for juices and cocktails.',
        shortDescription: 'Exotic Andean citrus pulp',
      },
    },
    {
      slug: 'guanabana-pulpa',
      en: {
        name: 'Soursop Pulp',
        description:
          'Frozen soursop pulp, tropical fruit with creamy texture and unique sweet-sour flavor. Highly valued for health properties.',
        shortDescription: 'Tropical fruit with health properties',
      },
    },
    {
      slug: 'almendras-tropicales',
      en: {
        name: 'Tropical Almonds',
        description:
          'Tropical almonds from Ecuadorian varieties. Traditional cultivation with modern methods.',
        shortDescription: 'Ecuadorian variety almonds',
      },
    },
    // Missing translations - fixing slug mismatches and adding new ones
    {
      slug: 'rosas-rojas-premium',
      en: {
        name: 'Premium Red Roses',
        description:
          "Red roses from Ecuador's highlands. Ecuador is one of the world's leading flower exporters, especially high-quality roses.",
        shortDescription: 'Premium roses with MPS certification',
      },
    },
    {
      slug: 'larvas-camaron-postlarva',
      en: {
        name: 'Shrimp Post-Larvae',
        description:
          'Pathogen-free shrimp larvae produced in certified laboratories with cutting-edge technology for sustainable aquaculture and Ecuadorian shrimp sector development.',
        shortDescription: 'Certified shrimp larvae for aquaculture',
      },
    },
    {
      slug: 'aguacate-hass-premium',
      en: {
        name: 'Aguacate Hass Premium',
        description:
          "Premium Hass avocado from Ecuador's highlands. Exceptional quality for international export.",
        shortDescription: 'Premium quality Hass avocado',
      },
    },
    {
      slug: 'atun-fresco-pacifico',
      en: {
        name: 'Fresh Pacific Tuna',
        description:
          "Fresh tuna caught in Pacific waters off Ecuador's coast. Quick freezing to preserve freshness and quality.",
        shortDescription: 'Fresh Pacific tuna',
      },
    },
    {
      slug: 'calabaza-premium',
      en: {
        name: 'Premium Squash',
        description:
          'Premium squash cultivated in Ecuador with specialized techniques for excellent quality.',
        shortDescription: 'Premium export squash',
      },
    },
    {
      slug: 'camote-dulce',
      en: {
        name: 'Sweet Potato',
        description:
          'Sweet potato from Ecuadorian tropical lands. Rich in nutrients and natural sweetness.',
        shortDescription: 'Tropical sweet potato',
      },
    },
    {
      slug: 'cana-azucar',
      en: {
        name: 'Sugar Cane',
        description:
          "Sugar cane from Ecuador's coastal lowlands. Quality cane for sugar and derivative production.",
        shortDescription: 'Premium sugar cane',
      },
    },
    {
      slug: 'cebolla-premium',
      en: {
        name: 'Premium Onion',
        description:
          "Onion cultivated in Ecuador's highlands. Excellent quality for export and local consumption.",
        shortDescription: 'Highland premium onion',
      },
    },
    {
      slug: 'chayote-organico',
      en: {
        name: 'Organic Chayote',
        description:
          'Organic chayote from Ecuador. Versatile vegetable with mild flavor and crunchy texture.',
        shortDescription: 'Certified organic chayote',
      },
    },
    {
      slug: 'coco-tropical',
      en: {
        name: 'Tropical Coconut',
        description: "Coconut from Ecuador's tropical coast. Fresh and quality for export.",
        shortDescription: 'Fresh tropical coconut',
      },
    },
    {
      slug: 'curcuma',
      en: {
        name: 'Turmeric',
        description:
          'Fresh turmeric grown in Ecuador. Intense color and flavor for culinary and medicinal use.',
        shortDescription: 'Fresh organic turmeric',
      },
    },
    {
      slug: 'jengibre-fresco',
      en: {
        name: 'Fresh Ginger',
        description:
          'Fresh ginger from Ecuador. Intense flavor and superior quality for international markets.',
        shortDescription: 'Premium fresh ginger',
      },
    },
    {
      slug: 'name-tropical',
      en: {
        name: 'Tropical Yam',
        description:
          'Tropical yam from Ecuador. Traditional tuber with excellent nutritional value.',
        shortDescription: 'Ecuadorian tropical yam',
      },
    },
    {
      slug: 'nampi',
      en: {
        name: 'Nampi',
        description:
          'Nampi from Ecuador, root tuber with unique flavor. Traditional in Ecuadorian cuisine.',
        shortDescription: 'Traditional Ecuadorian tuber',
      },
    },
    {
      slug: 'palmito-organico',
      en: {
        name: 'Organic Hearts of Palm',
        description:
          'Organic hearts of palm from sustainable Ecuadorian plantations. Premium quality for gourmet dishes.',
        shortDescription: 'Certified organic hearts of palm',
      },
    },
    {
      slug: 'papaya-hawaiana',
      en: {
        name: 'Hawaiian Papaya',
        description:
          "Hawaiian papaya grown in Ecuador's tropical climate. Sweet and juicy with excellent shelf life.",
        shortDescription: 'Sweet Hawaiian papaya',
      },
    },
    {
      slug: 'pina-golden',
      en: {
        name: 'Golden Pineapple',
        description:
          "Golden pineapple cultivated in Ecuador's optimal tropical climate. Extra sweet with golden color.",
        shortDescription: 'Extra sweet golden pineapple',
      },
    },
    {
      slug: 'platano-verde',
      en: {
        name: 'Green Plantain',
        description:
          'Green plantain from Ecuador, staple in many cuisines. Ideal for frying, baking, or cooking.',
        shortDescription: 'Premium green plantain',
      },
    },
    {
      slug: 'yuca-premium',
      en: {
        name: 'Premium Cassava',
        description:
          'Premium cassava from Ecuador. Versatile tuber with excellent quality for export.',
        shortDescription: 'Export quality cassava',
      },
    },
    {
      slug: 'arboles-mango',
      en: {
        name: 'Mango Trees',
        description:
          'Mango tree seedlings from certified Ecuadorian nurseries. Adaptable varieties for tropical climates.',
        shortDescription: 'Certified mango tree seedlings',
      },
    },
    {
      slug: 'arboles-aguacate',
      en: {
        name: 'Avocado Trees',
        description:
          'Avocado tree seedlings, Hass and other varieties. From certified Ecuadorian nurseries.',
        shortDescription: 'Certified avocado tree seedlings',
      },
    },
    {
      slug: 'arboles-citricos',
      en: {
        name: 'Citrus Trees',
        description:
          'Citrus tree seedlings including orange, lemon, lime, and grapefruit. From certified Ecuadorian nurseries.',
        shortDescription: 'Certified citrus tree seedlings',
      },
    },
    {
      slug: 'nueces-macadamia',
      en: {
        name: 'Macadamia Nuts',
        description:
          'Macadamia nuts from specialized cultivation in Ecuador. Premium quality with certification.',
        shortDescription: 'Specialized macadamia cultivation',
      },
    },
    {
      slug: 'nueces-pecanas',
      en: {
        name: 'Pecan Nuts',
        description:
          'Pecan nuts adapted to the Ecuadorian tropics. Innovative cultivation with specialized techniques.',
        shortDescription: 'Tropically adapted pecan nuts',
      },
    },
  ];

  // Create translations for all products
  for (const prodTrans of productTranslations) {
    const product = await prisma.product.findUnique({ where: { slug: prodTrans.slug } });
    if (product) {
      // Spanish translation (original data)
      await prisma.productTranslation.upsert({
        where: { productId_languageId: { productId: product.id, languageId: spanishLang.id } },
        update: {},
        create: {
          productId: product.id,
          languageId: spanishLang.id,
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
          isAutoTranslated: false,
        },
      });

      // English translation
      await prisma.productTranslation.upsert({
        where: { productId_languageId: { productId: product.id, languageId: englishLang.id } },
        update: {},
        create: {
          productId: product.id,
          languageId: englishLang.id,
          name: prodTrans.en.name,
          description: prodTrans.en.description,
          shortDescription: prodTrans.en.shortDescription,
          seoTitle: prodTrans.en.name + ' - Zivah International Ecuador',
          seoDescription: prodTrans.en.shortDescription + '. Premium Ecuadorian export.',
          isAutoTranslated: false,
        },
      });
    }
  }

  console.log('✅ Languages and translations created successfully!');
  console.log('  - 2 languages: Spanish (default), English');
  console.log('  - 3 category translations (ES/EN)');
  console.log('  - 26 product translations (ES/EN)');

  // Create product prices for different measures
  console.log('💰 Creating product prices...');

  // Get some sample products for pricing
  const products = await prisma.product.findMany({ take: 5 });
  const measures = await prisma.measure.findMany();

  if (products.length > 0 && measures.length > 0) {
    // Create pricing for the first product (Banano)
    const bananoProduct = products[0];
    const kgMeasure = measures.find((m: any) => m.shortName === 'kg');
    const lbMeasure = measures.find((m: any) => m.shortName === 'lb');
    const tonMeasure = measures.find((m: any) => m.shortName === 'MT');

    if (kgMeasure && lbMeasure && tonMeasure) {
      await prisma.productPrice.upsert({
        where: {
          productId_measureId: {
            productId: bananoProduct.id,
            measureId: kgMeasure.id,
          },
        },
        update: {},
        create: {
          productId: bananoProduct.id,
          measureId: kgMeasure.id,
          price: 1.5,
          isActive: true,
          effectiveDate: new Date(),
        },
      });

      await prisma.productPrice.upsert({
        where: {
          productId_measureId: {
            productId: bananoProduct.id,
            measureId: lbMeasure.id,
          },
        },
        update: {},
        create: {
          productId: bananoProduct.id,
          measureId: lbMeasure.id,
          price: 0.68,
          isActive: true,
          effectiveDate: new Date(),
        },
      });

      await prisma.productPrice.upsert({
        where: {
          productId_measureId: {
            productId: bananoProduct.id,
            measureId: tonMeasure.id,
          },
        },
        update: {},
        create: {
          productId: bananoProduct.id,
          measureId: tonMeasure.id,
          price: 1500.0,
          isActive: true,
          effectiveDate: new Date(),
        },
      });
    }

    // Create pricing for second product if available
    if (products.length > 1) {
      const secondProduct = products[1];
      if (kgMeasure) {
        await prisma.productPrice.upsert({
          where: {
            productId_measureId: {
              productId: secondProduct.id,
              measureId: kgMeasure.id,
            },
          },
          update: {},
          create: {
            productId: secondProduct.id,
            measureId: kgMeasure.id,
            price: 2.25,
            isActive: true,
            effectiveDate: new Date(),
          },
        });
      }
    }
  }

  // Create measure compatibility data
  console.log('🔄 Creating measure compatibility...');

  if (measures.length > 0) {
    const kgMeasure = measures.find((m: any) => m.shortName === 'kg');
    const lbMeasure = measures.find((m: any) => m.shortName === 'lb');
    const tonMeasure = measures.find((m: any) => m.shortName === 'MT');

    if (kgMeasure && lbMeasure) {
      await prisma.measureCompatibility.upsert({
        where: {
          fromMeasureId_toMeasureId: {
            fromMeasureId: kgMeasure.id,
            toMeasureId: lbMeasure.id,
          },
        },
        update: {},
        create: {
          fromMeasureId: kgMeasure.id,
          toMeasureId: lbMeasure.id,
          conversionFactor: 2.20462,
          isActive: true,
        },
      });

      await prisma.measureCompatibility.upsert({
        where: {
          fromMeasureId_toMeasureId: {
            fromMeasureId: lbMeasure.id,
            toMeasureId: kgMeasure.id,
          },
        },
        update: {},
        create: {
          fromMeasureId: lbMeasure.id,
          toMeasureId: kgMeasure.id,
          conversionFactor: 0.453592,
          isActive: true,
        },
      });
    }

    if (kgMeasure && tonMeasure) {
      await prisma.measureCompatibility.upsert({
        where: {
          fromMeasureId_toMeasureId: {
            fromMeasureId: kgMeasure.id,
            toMeasureId: tonMeasure.id,
          },
        },
        update: {},
        create: {
          fromMeasureId: kgMeasure.id,
          toMeasureId: tonMeasure.id,
          conversionFactor: 0.001,
          isActive: true,
        },
      });

      await prisma.measureCompatibility.upsert({
        where: {
          fromMeasureId_toMeasureId: {
            fromMeasureId: tonMeasure.id,
            toMeasureId: kgMeasure.id,
          },
        },
        update: {},
        create: {
          fromMeasureId: tonMeasure.id,
          toMeasureId: kgMeasure.id,
          conversionFactor: 1000.0,
          isActive: true,
        },
      });
    }
  }

  console.log('🔐 Creating admin user...');
  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@zivahinternational.com';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'admin123!';

  const { hashPassword } = await import('../src/lib/password');

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
      fullName: 'Admin',
      role: 'admin',
      isActive: true,
    },
  });

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
