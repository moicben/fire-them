/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Utiliser l'exportation statique
  webpack: (config) => {
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.emit.tapAsync('ReplaceDoubleSlashesPlugin', (compilation, callback) => {
          Object.keys(compilation.assets).forEach((asset) => {
            if (asset.includes('//')) {
              const newAsset = asset.replace(/\/\//g, '/');
              compilation.assets[newAsset] = compilation.assets[asset];
              delete compilation.assets[asset];
            }
          });
          callback();
        });
      },
    });
    return config;
  },
};

module.exports = nextConfig;