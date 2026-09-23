/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // We serve admin-uploaded media from our own /api/images route with <img>,
    // so the built-in optimizer is not required.
    unoptimized: true,
  },
};

export default nextConfig;
