/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Utiliser l'exportation statique
  async redirects() {
    return [
      {
        source: '/lead-backend-developer',
        destination: '/', // Update this to the correct destination
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;