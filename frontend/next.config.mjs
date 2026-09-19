/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    const backend = process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8080';
    return [{ source: '/api/v1/:path*', destination: `${backend}/api/v1/:path*` }];
  },
  typedRoutes: false
};

export default nextConfig;
