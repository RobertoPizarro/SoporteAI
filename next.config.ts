import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false, // Cambiar a false para producción
  },
  eslint: {
    ignoreDuringBuilds: false, // Cambiar a false para producción
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: process.env.NEXT_PUBLIC_BACKEND_URL + '/:path*', // URL del backend en producción
      },
    ];
  },
};

export default nextConfig;
