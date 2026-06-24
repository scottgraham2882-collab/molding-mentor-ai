import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/",
        permanent: true,
      },
      {
        source: "/dictionary",
        destination: "/molding-dictionary",
        permanent: true,
      },
      {
        source: "/skills-matrix",
        destination: "/training/skills-matrix",
        permanent: true,
      },
      {
        source: "/process-guide",
        destination: "/process-adjustment-guide",
        permanent: true,
      },
      {
        source: "/handoff",
        destination: "/shift-handoff",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
