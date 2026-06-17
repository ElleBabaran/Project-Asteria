const isGithubActions = process.env.GITHUB_ACTIONS || false;
const repo = 'Project-Asteria';
const basePath = isGithubActions ? `/${repo}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: basePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
