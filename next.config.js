/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.io", "ikzttp.mypinata.cloud", "i.ibb.co"],
  },
};

module.exports = nextConfig;
