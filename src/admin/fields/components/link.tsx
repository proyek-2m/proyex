'use client'
import type { CollectionSlug, TextFieldClientProps } from 'payload'
import { useEffect, useState } from 'react'

import Icon from '$components/Icon'
import { Button, FieldLabel, Link, TextInput, useFormFields } from '@payloadcms/ui'

export const LinkField: React.FC<TextFieldClientProps> = ({ field, path, ...props }) => {
	const [fullLink, setFullLink] = useState<string>('')

	const linkValue = useFormFields(([fields]) => {
		return fields?.link?.value as string
	})

	useEffect(() => {
		const pathName = window.location.pathname

		if (pathName.includes('collections') && !pathName.includes('/create')) {
			const restEndpoint = pathName.split('collections/')[1] as CollectionSlug

			async function postLinkInject() {
				try {
					const query = await fetch(`/api/${restEndpoint}`)

					const result = await query.json()

					if ('link' in result && result.link && typeof result.link === 'string') {
						setFullLink(result.link)
					}
				} catch {
					return null
				}
			}

			postLinkInject()
		}

		// Trigger when linkValue changes
	}, [linkValue])

	if (!fullLink) {
		return null
	}

	return (
		<>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: 4,
				}}
			>
				<FieldLabel {...field} />
				<Link
					href={fullLink}
					target="_blank"
				>
					<Button
						buttonStyle="pill"
						size="small"
						className="cta"
					>
						<Icon
							name="external-link"
							size={14}
						/>
					</Button>
				</Link>
			</div>
			<TextInput
				{...field}
				{...props}
				label={undefined}
				value={fullLink || linkValue}
				readOnly
				onChange={() => {}}
				path={path || field.name}
			/>
			<style>{`
            .cta {
                margin: 0
            }
        `}</style>
		</>
	)
}
