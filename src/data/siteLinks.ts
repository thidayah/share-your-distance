export const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP || 'https://wa.me/6287825801252';

export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM || 'https://www.instagram.com/sobatsabtu';

export const EMAIL_ADDRESS = (process.env.NEXT_PUBLIC_EMAIL || 'contact@runminders.com')
  .replace(/^mailto:/, '');
export const EMAIL_URL = `mailto:${EMAIL_ADDRESS}`;

export const DEVELOPER_URL = process.env.NEXT_PUBLIC_DEVELOPER_URL || 'https://thidayah.github.io/';
