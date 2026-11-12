import http from 'node:http';

const categories = [
  { id: 1, name: 'Productos del Mar', slug: 'marinos-y-pesca', isActive: true },
  { id: 2, name: 'Agrícolas', slug: 'agricolas', isActive: true },
];

const products = [
  {
    id: 11,
    name: 'Camarón Blanco Premium',
    slug: 'camaron-blanco-premium',
    shortDescription: 'Camarón vannamei IQF.',
    imageUrl: 'https://images.unsplash.com/broken-stored-image.jpg',
    description: 'Camarón blanco ecuatoriano para exportación.',
    origin: 'Guayas, Ecuador',
    stockQuantity: 1000,
    specifications: { Calibre: '16/20' },
    certifications: ['BAP', 'HACCP'],
    isFeatured: true,
    isActive: true,
    category: categories[0],
  },
  {
    id: 12,
    name: 'Larvas de camarón Post-Larva',
    slug: 'larvas-camaron-postlarva',
    shortDescription: 'Post-larvas PL10–PL15.',
    origin: 'Guayas, Ecuador',
    stockQuantity: 1000,
    certifications: ['BAP'],
    isFeatured: false,
    isActive: true,
    category: categories[0],
  },
  {
    id: 13,
    name: 'Atún Fresco del Pacífico',
    slug: 'atun-fresco-pacifico',
    shortDescription: 'Lomos y steak de atún.',
    origin: 'Manta, Ecuador',
    stockQuantity: 1000,
    certifications: ['HACCP', 'MSC'],
    isFeatured: true,
    isActive: true,
    category: categories[0],
  },
];

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:4010');
  res.setHeader('content-type', 'application/json');

  if (url.pathname === '/api/products') {
    const search = url.searchParams.get('search');
    const data = search ? products.filter(product => product.slug === search) : products;
    return res.end(JSON.stringify({ error: false, data }));
  }

  if (url.pathname === '/api/categories') {
    return res.end(JSON.stringify({ error: false, data: categories }));
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: true, message: 'Not found' }));
});

server.listen(4010, '127.0.0.1');
