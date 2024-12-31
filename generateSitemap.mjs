async function generateSitemap() {
  const hostname = 'https://fire-them.com'; // Remplacez par votre hostname réel
  const sitemap = new SitemapStream({ hostname });

  // Add static pages
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });

  // Fetch locations and occupations from Supabase
  const locations = await getLocations();
  const occupations = await getOccupations();

  // Generate URLs based on location_slug and occupation_slug
  locations.forEach(location => {
    // Add URL for /location_slug
    sitemap.write({ url: `/${location.location_slug}`, changefreq: 'weekly', priority: 0.8 });

    occupations.forEach(occupation => {
      // Add URL for /location_slug/occupation_slug
      sitemap.write({ url: `/${location.location_slug}/${occupation.occupation_slug}`, changefreq: 'weekly', priority: 0.7 });
    });

    // Add URL for /occupations/location_slug
    sitemap.write({ url: `/occupations/${location.location_slug}`, changefreq: 'weekly', priority: 0.8 });
  });

  sitemap.end();

  const sitemapPath = resolve('public/sitemap.xml');
  const writeStream = createWriteStream(sitemapPath);

  sitemap.pipe(writeStream).on('finish', () => {
    console.log('Sitemap generated at', sitemapPath);
  }).on('error', (err) => {
    console.error('Error generating sitemap:', err);
  });
}

await generateSitemap();