import { useWindowScroll } from '@mantine/hooks'

export const useWindowScrollTo = () => {
	const [_, scrollTo] = useWindowScroll()

	return (dom: HTMLElement | null) => {
		if (!dom) return

		const header: HTMLElement | null = document.querySelector('[data-slot="header"]')

		const errorPosition = dom.getBoundingClientRect().top + window.scrollY
		const offsetTop = header?.offsetHeight || 0

		scrollTo({
			y: errorPosition - offsetTop - 20,
		})
	}
}
