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
      // Common singular typo of /dashboard/:role/settings — send it to the
      // right place for every role (seeker, recruiter, admin).
      {
        source: "/dashboard/:role/setting",
        destination: "/dashboard/:role/settings",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
