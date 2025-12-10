/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // since you're using static export
  images: {
    unoptimized: true, // <-- FIX for Image Optimization error
  },
};

export default nextConfig;