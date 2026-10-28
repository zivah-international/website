/**
 * Single source of truth for the public contact channels.
 *
 * Components (Footer, Contact, Quote, StructuredData) import from here
 * instead of re-declaring addresses, phone numbers or the WhatsApp URL.
 */
export const CONTACT_INFO = {
  email: 'sales@zivahinternational.com',
  phone: '+593 99 900 2893',
  phoneHref: 'tel:+593999002893',
  whatsapp:
    'https://wa.me/593999002893?text=Hola%2C%20me%20pongo%20en%20contacto%20desde%20la%20web%20de%20ZIVAH%20International.',
  ecuador: 'Samborondón, Guayas',
  miami: 'Miami, Florida',
  directions:
    'https://www.google.com/maps/search/?api=1&query=Samborond%C3%B3n%2C%20Guayas%2C%20Ecuador',
} as const;
