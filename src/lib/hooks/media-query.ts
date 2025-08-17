import { useMediaQuery } from '@mantine/hooks'

export const useIsMedia = () => {
	const isDesktop = useMediaQuery('(min-width: 1200px)')
	const isBelowDesktop = useMediaQuery('(max-width: 1199px)')
	const isTablet = useMediaQuery('(min-width: 601px) and (max-width: 1199px)')
	const isMobile = useMediaQuery('(max-width: 600px)')

	return {
		desktop: isDesktop,
		belowDesktop: isBelowDesktop,
		tablet: isTablet,
		mobile: isMobile,
	}
}
