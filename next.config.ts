import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Common misspelling of /dashboard — send it to the right place.
      {
        source: "/deshboard",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/deshboard/:path*",
        destination: "/dashboard/:path*",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
