'use client'
import { useShallowEffect } from '@mantine/hooks'
import { motion, useAnimation, useInView, type HTMLMotionProps, type Variants } from 'motion/react'
import { useRef } from 'react'

const container: Variants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.05,
			delayChildren: 0.2,
		},
	},
}

const item: Variants = {
	hidden: {
		opacity: 0,
		y: 16,
		filter: 'blur(4px)',
	},
	show: {
		opacity: 1,
		scale: 1,
		y: 0,
		filter: 'blur(0px)',
		transition: {
			delay: 0.2,
			type: 'spring',
			stiffness: 150,
			damping: 19,
			mass: 1.2,
		},
	},
}

function FadeContainer({ children, ...props }: HTMLMotionProps<'div'>) {
	return (
		<motion.div
			{...props}
			variants={container}
			initial="hidden"
			animate="show"
		>
			{children}
		</motion.div>
	)
}

function FadeDiv({ children, ...props }: HTMLMotionProps<'div'>) {
	const controls = useAnimation()
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref, {
		once: true,
		initial: false,
	})

	useShallowEffect(() => {
		if (inView) {
			controls.start('show')
		} else {
			controls.start('hidden')
		}
	}, [controls, inView])

	return (
		<motion.div
			{...props}
			ref={ref}
			data-slot="fade"
			animate={controls}
			variants={item}
		>
			{children}
		</motion.div>
	)
}

function FadeSpan({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<motion.span
			variants={item}
			className={className}
		>
			{children}
		</motion.span>
	)
}

export { FadeContainer, FadeDiv, FadeSpan }
