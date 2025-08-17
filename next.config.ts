import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		formats: ['image/avif'],
		dangerouslyAllowSVG: true,
		minimumCacheTTL: 60 * 60 * 24 * 30,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*',
			},
		],
	},
	experimental: {
		useCache: true,
		reactCompiler: false,
		optimizePackageImports: [
			'@mantine/core',
			'@mantine/hooks',
			'@mantine/form',
			'@mantine/carousel',
			'@mantine/nprogress',
		],
	},
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
