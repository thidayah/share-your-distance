import type { NextConfig } from "next";

// Standalone pages that are no longer part of the revamp. The files stay on disk
// so they can be restored, but they are no longer reachable from the public site.
const retiredPages = ["/about", "/contact", "/privacy-policy", "/terms-of-service"];

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  async redirects() {
    return [
      { source: "/faq", destination: "/", permanent: false },
      ...retiredPages.map((source) => ({
        source,
        destination: "/",
        permanent: false,
      })),
    ];
  },
};

export default nextConfig;
