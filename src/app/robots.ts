import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/login', '/signup', '/offline'],
      },
    ],
    sitemap: 'https://momandpopstore.com/sitemap.xml',
    host: 'https://momandpopstore.com',
  };
}
