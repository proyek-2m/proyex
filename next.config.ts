import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	reactCompiler: true,
	reactStrictMode: true,
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		formats: ['image/avif'],
		qualities: [90],
		dangerouslyAllowSVG: true,
		minimumCacheTTL: 60 * 60 * 24 * 30,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*',
			},
		],
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	experimental: {
		useCache: true,
		turbopackFileSystemCacheForDev: true,
		optimizeCss: true,
		optimizeServerReact: true,
		optimizePackageImports: [
			'@mantine/core',
			'@mantine/hooks',
			'@mantine/form',
			'@mantine/nprogress',
			'@mantine/notifications',
		],
		serverActions: {
			bodySizeLimit: '10mb',
		},
	},
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
