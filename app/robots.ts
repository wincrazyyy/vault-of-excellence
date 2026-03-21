import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/admin/', '/auth/', '/apply/', '/api/'], 
    },
    sitemap: 'https://voetutor.com/sitemap.xml',
  };
}
