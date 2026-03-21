import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://voetutor.com';

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data: tutors, error } = await supabase
    .from('tutors')
    .select('id')
    .eq('is_verified', true);

  if (error) {
    console.error("Sitemap generation error:", error);
  }

  const tutorUrls: MetadataRoute.Sitemap = (tutors || []).map((tutor) => ({
    url: `${baseUrl}/tutors/${tutor.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const staticRoutes: MetadataRoute.Sitemap = ['', '/tutors', '/privacy', '/terms'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.5,
  }));

  return [...staticRoutes, ...tutorUrls];
}
