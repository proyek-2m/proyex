import type { Field } from 'payload'

export const formFields = ({ defaultFields }: { defaultFields: Field[] }) => {
	const fields: Field[] = []

	defaultFields.forEach((field) => {
		if (field.type === 'blocks' && field.name === 'fields') {
			const blocks = field.blocks.filter(
				(block) =>
					block.slug !== 'country' && block.slug !== 'state' && block.slug !== 'message',
			)

			blocks.push({
				slug: 'upload',
				dbName: (args) => {
					if (args.tableName) {
						return args.tableName + '_upb'
					}

					return 'upb'
				},
				fields: [
					{
						type: 'row',
						fields: [
							{
								name: 'name',
								type: 'text',
								required: true,
							},
							{
								name: 'label',
								type: 'text',
							},
						],
					},
					{
						type: 'row',
						fields: [
							{
								name: 'width',
								type: 'number',
								min: 0,
								max: 100,
								admin: {
									width: '50%',
								},
							},
							{
								name: 'defaultValue',
								type: 'text',
								admin: {
									width: '50%',
								},
							},
						],
					},
					{
						type: 'row',
						fields: [
							{
								name: 'required',
								type: 'checkbox',
								admin: {
									width: '50%',
								},
							},
							{
								name: 'allowedTypes',
								type: 'select',
								enumName: 'upbalwtyp',
								hasMany: true,
								admin: {
									width: '50%',
								},
								options: [
									{
										label: 'Image',
										value: 'image',
									},
									{
										label: 'PDF',
										value: 'pdf',
									},
								],
							},
						],
					},
					{
						name: 'placeholder',
						type: 'text',
					},
				],
			})

			blocks.push({
				slug: 'telephone',
				dbName: (args) => {
					if (args.tableName) {
						return args.tableName + '_tlb'
					}

					return 'tlb'
				},
				fields: [
					{
						type: 'row',
						fields: [
							{
								name: 'name',
								type: 'text',
								required: true,
							},
							{
								name: 'label',
								type: 'text',
							},
						],
					},
					{
						type: 'row',
						fields: [
							{
								name: 'placeholder',
								type: 'text',
								admin: {
									width: '50%',
								},
							},
							{
								name: 'defaultValue',
								type: 'text',
								admin: {
									width: '50%',
								},
							},
						],
					},
					{
						type: 'row',
						fields: [
							{
								name: 'width',
								type: 'number',
								min: 0,
								max: 100,
								admin: {
									width: '50%',
								},
							},
							{
								name: 'required',
								type: 'checkbox',
								admin: {
									width: '50%',
								},
							},
						],
					},
				],
			})

			blocks.push({
				slug: 'checkboxOptions',
				dbName: (args) => {
					if (args.tableName) {
						return args.tableName + '_cob'
					}

					return 'cob'
				},
				fields: [
					{
						type: 'row',
						fields: [
							{
								name: 'name',
								type: 'text',
								required: true,
							},
							{
								name: 'label',
								type: 'text',
							},
						],
					},
					{
						type: 'row',
						fields: [
							{
								name: 'width',
								type: 'number',
								min: 0,
								max: 100,
								admin: {
									width: '50%',
								},
							},
							{
								name: 'defaultValue',
								type: 'text',
								admin: {
									width: '50%',
								},
							},
						],
					},
					{
						type: 'row',
						fields: [
							{
								name: 'column',
								type: 'number',
								min: 1,
								admin: {
									width: '33.333%',
								},
							},
							{
								name: 'gap',
								type: 'number',
								min: 1,
								admin: {
									width: '33.333%',
								},
							},
							{
								name: 'required',
								type: 'checkbox',
								admin: {
									width: '33.333%',
								},
							},
						],
					},
					{
						name: 'options',
						type: 'array',
						dbName: (args) => {
							if (args.tableName) {
								return args.tableName + '_coopts'
							}

							return 'coopts'
						},
						fields: [
							{
								type: 'row',
								fields: [
									{
										name: 'label',
										type: 'text',
										required: true,
									},
									{
										name: 'value',
										type: 'text',
										required: true,
									},
								],
							},
						],
					},
				],
			})

			blocks.push({
				slug: 'radioOptions',
				dbName: (args) => {
					if (args.tableName) {
						return args.tableName + '_rob'
					}

					return 'rob'
				},
				fields: [
					{
						type: 'row',
						fields: [
							{
								name: 'name',
								type: 'text',
								required: true,
							},
							{
								name: 'label',
								type: 'text',
							},
						],
					},
					{
						type: 'row',
						fields: [
							{
								name: 'width',
								type: 'number',
								min: 0,
								max: 100,
								admin: {
									width: '50%',
								},
							},
							{
								name: 'defaultValue',
								type: 'text',
								admin: {
									width: '50%',
								},
							},
						],
					},
					{
						type: 'row',
						fields: [
							{
								name: 'column',
								type: 'number',
								min: 1,
								admin: {
									width: '33.333%',
								},
							},
							{
								name: 'gap',
								type: 'number',
								min: 1,
								admin: {
									width: '33.333%',
								},
							},
							{
								name: 'required',
								type: 'checkbox',
								admin: {
									width: '33.333%',
								},
							},
						],
					},
					{
						name: 'options',
						type: 'array',
						dbName: (args) => {
							if (args.tableName) {
								return args.tableName + '_roopts'
							}

							return 'roopts'
						},
						fields: [
							{
								type: 'row',
								fields: [
									{
										name: 'label',
										type: 'text',
										required: true,
									},
									{
										name: 'value',
										type: 'text',
										required: true,
									},
								],
							},
						],
					},
				],
			})

			const blockSelectIndex = field.blocks.findIndex((block) => block.slug === 'select')

			if (blockSelectIndex !== -1) {
				field.blocks[blockSelectIndex].fields.push({
					name: 'multiple',
					type: 'checkbox',
				})
			}

			const blockTextareaIndex = field.blocks.findIndex((block) => block.slug === 'textarea')

			if (blockTextareaIndex !== -1) {
				field.blocks[blockTextareaIndex].fields.push({
					name: 'placeholder',
					type: 'text',
				})
			}

			const blockEmailIndex = field.blocks.findIndex((block) => block.slug === 'email')

			if (blockEmailIndex !== -1) {
				field.blocks[blockEmailIndex].fields.push({
					name: 'placeholder',
					type: 'text',
				})
			}

			const blockTextIndex = field.blocks.findIndex((block) => block.slug === 'text')

			if (blockTextIndex !== -1) {
				field.blocks[blockTextIndex].fields.push({
					name: 'placeholder',
					type: 'text',
				})
			}

			const blockNumberIndex = field.blocks.findIndex((block) => block.slug === 'number')

			if (blockNumberIndex !== -1) {
				field.blocks[blockNumberIndex].fields.push({
					name: 'placeholder',
					type: 'text',
				})
			}

			field.blocks = blocks
		}

		fields.push(field)
	})

	return defaultFields
}
