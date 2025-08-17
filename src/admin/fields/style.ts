import type { Field, FieldBase, Option } from 'payload'

export const colorOptions: Option[] = [
	{
		label: 'Primary',
		value: 'primary',
	},
	{
		label: 'Primary Soft',
		value: 'primary-soft',
	},
	{
		label: 'Primary Dark',
		value: 'primary-dark',
	},
	{
		label: 'Secondary',
		value: 'secondary',
	},
	{
		label: 'Secondary Soft',
		value: 'secondary-soft',
	},
	{
		label: 'Secondary Dark',
		value: 'secondary-dark',
	},
	{
		label: 'Red',
		value: 'red',
	},
	{
		label: 'Red Soft',
		value: 'red-soft',
	},
	{
		label: 'Red Dark',
		value: 'red-dark',
	},
	{
		label: 'Orange',
		value: 'orange',
	},
	{
		label: 'Orange Soft',
		value: 'orange-soft',
	},
	{
		label: 'Orange Dark',
		value: 'orange-dark',
	},
	{
		label: 'Amber',
		value: 'amber',
	},
	{
		label: 'Amber Soft',
		value: 'amber-soft',
	},
	{
		label: 'Amber Dark',
		value: 'amber-dark',
	},
	{
		label: 'Yellow',
		value: 'yellow',
	},
	{
		label: 'Yellow Soft',
		value: 'yellow-soft',
	},
	{
		label: 'Yellow Dark',
		value: 'yellow-dark',
	},
	{
		label: 'Lime',
		value: 'lime',
	},
	{
		label: 'Lime Soft',
		value: 'lime-soft',
	},
	{
		label: 'Lime Dark',
		value: 'lime-dark',
	},
	{
		label: 'Green',
		value: 'green',
	},
	{
		label: 'Green Soft',
		value: 'green-soft',
	},
	{
		label: 'Green Dark',
		value: 'green-dark',
	},
	{
		label: 'Emerald',
		value: 'emerald',
	},
	{
		label: 'Emerald Soft',
		value: 'emerald-soft',
	},
	{
		label: 'Emerald Dark',
		value: 'emerald-dark',
	},
	{
		label: 'Teal',
		value: 'teal',
	},
	{
		label: 'Teal Soft',
		value: 'teal-soft',
	},
	{
		label: 'Teal Dark',
		value: 'teal-dark',
	},
	{
		label: 'Cyan',
		value: 'cyan',
	},
	{
		label: 'Cyan Soft',
		value: 'cyan-soft',
	},
	{
		label: 'Cyan Dark',
		value: 'cyan-dark',
	},
	{
		label: 'Sky',
		value: 'sky',
	},
	{
		label: 'Sky Soft',
		value: 'sky-soft',
	},
	{
		label: 'Sky Dark',
		value: 'sky-dark',
	},
	{
		label: 'Blue',
		value: 'blue',
	},
	{
		label: 'Blue Soft',
		value: 'blue-soft',
	},
	{
		label: 'Blue Dark',
		value: 'blue-dark',
	},
	{
		label: 'Indigo',
		value: 'indigo',
	},
	{
		label: 'Indigo Soft',
		value: 'indigo-soft',
	},
	{
		label: 'Indigo Dark',
		value: 'indigo-dark',
	},
	{
		label: 'Violet',
		value: 'violet',
	},
	{
		label: 'Violet Soft',
		value: 'violet-soft',
	},
	{
		label: 'Violet Dark',
		value: 'violet-dark',
	},
	{
		label: 'Purple',
		value: 'purple',
	},
	{
		label: 'Purple Soft',
		value: 'purple-soft',
	},
	{
		label: 'Purple Dark',
		value: 'purple-dark',
	},
	{
		label: 'Fuchsia',
		value: 'fuchsia',
	},
	{
		label: 'Fuchsia Soft',
		value: 'fuchsia-soft',
	},
	{
		label: 'Fuchsia Dark',
		value: 'fuchsia-dark',
	},
	{
		label: 'Pink',
		value: 'pink',
	},
	{
		label: 'Pink Soft',
		value: 'pink-soft',
	},
	{
		label: 'Pink Dark',
		value: 'pink-dark',
	},
	{
		label: 'Rose',
		value: 'rose',
	},
	{
		label: 'Rose Soft',
		value: 'rose-soft',
	},
	{
		label: 'Rose Dark',
		value: 'rose-dark',
	},
	{
		label: 'Gray',
		value: 'gray',
	},
	{
		label: 'Gray Soft',
		value: 'gray-soft',
	},
	{
		label: 'Gray Dark',
		value: 'gray-dark',
	},
	{
		label: 'Black',
		value: 'black',
	},
	{
		label: 'White',
		value: 'white',
	},
]

export const sizeOptions: Option[] = [
	{
		label: 'xs',
		value: 'xs',
	},
	{
		label: 'sm',
		value: 'sm',
	},
	{
		label: 'md',
		value: 'md',
	},
	{
		label: 'lg',
		value: 'lg',
	},
	{
		label: 'xl',
		value: 'xl',
	},
]

type StyleFieldBase = Pick<FieldBase, 'admin' | 'defaultValue' | 'required'> & { name?: string }

export const marginField = (_options?: StyleFieldBase): Field => {
	const options: FieldBase = {
		name: 'margin',
		..._options,
	}

	return {
		type: 'group',
		name: options.name,
		admin: options.admin,
		index: false,
		fields: [
			{
				type: 'row',
				fields: [
					{
						name: 'top',
						type: 'text',
						defaultValue: options.defaultValue,
						required: options.required,
						admin: {
							width: '25%',
							description: 'Fill the units with px, %, or em',
						},
					},
					{
						name: 'bottom',
						type: 'text',
						defaultValue: options.defaultValue,
						required: options.required,
						admin: {
							width: '25%',
							description: 'Fill the units with px, %, or em',
						},
					},
					{
						name: 'left',
						type: 'text',
						defaultValue: options.defaultValue,
						required: options.required,
						admin: {
							width: '25%',
							description: 'Fill the units with px, %, or em',
						},
					},
					{
						name: 'right',
						type: 'text',
						defaultValue: options.defaultValue,
						required: options.required,
						admin: {
							width: '25%',
							description: 'Fill the units with px, %, or em',
						},
					},
				],
			},
		],
	}
}

export const paddingField = (_options?: StyleFieldBase): Field => {
	const options: FieldBase = {
		name: 'padding',
		..._options,
	}

	return {
		type: 'group',
		name: options.name,
		admin: options.admin,
		index: false,
		fields: [
			{
				type: 'row',
				fields: [
					{
						name: 'top',
						type: 'text',
						defaultValue: options.defaultValue,
						required: options.required,
						admin: {
							width: '25%',
							description: 'Fill the units with px, %, or em',
						},
					},
					{
						name: 'bottom',
						type: 'text',
						defaultValue: options.defaultValue,
						required: options.required,
						admin: {
							width: '25%',
							description: 'Fill the units with px, %, or em',
						},
					},
					{
						name: 'left',
						type: 'text',
						defaultValue: options.defaultValue,
						required: options.required,
						admin: {
							width: '25%',
							description: 'Fill the units with px, %, or em',
						},
					},
					{
						name: 'right',
						type: 'text',
						defaultValue: options.defaultValue,
						required: options.required,
						admin: {
							width: '25%',
							description: 'Fill the units with px, %, or em',
						},
					},
				],
			},
		],
	}
}

export const gapField = (_options?: StyleFieldBase): Field => {
	const options: FieldBase = {
		name: 'gap',
		..._options,
	}

	return {
		type: 'group',
		name: options.name,
		admin: options.admin,
		index: false,
		fields: [
			{
				type: 'row',
				fields: [
					{
						name: 'base',
						type: 'text',
						defaultValue: options.defaultValue,
						required: options.required,
						admin: {
							width: '50%',
							description: 'Fill the units with px, %, or em',
						},
					},
					{
						name: 'vertical',
						type: 'text',
						admin: {
							width: '50%',
							description: 'Fill the units with px, %, or em',
						},
					},
				],
			},
		],
	}
}

export const backgroundImageField = (_options?: Omit<StyleFieldBase, 'defaultValue'>): Field => {
	const options: FieldBase = {
		name: 'backgroundImage',
		..._options,
	}

	return {
		type: 'group',
		name: options.name,
		admin: options.admin,
		index: false,
		fields: [
			{
				type: 'row',
				fields: [
					{
						name: 'general',
						type: 'upload',
						relationTo: 'asset',
						required: options.required,
						admin: {
							width: '50%',
						},
					},
					{
						name: 'mobile',
						type: 'upload',
						relationTo: 'asset',
						admin: {
							width: '50%',
						},
					},
				],
			},
		],
	}
}

export const backgroundColorField = (_options?: StyleFieldBase): Field => {
	const options: FieldBase = {
		name: 'backgroundColor',
		..._options,
	}

	return {
		type: 'group',
		name: options.name,
		admin: options.admin,
		index: false,
		fields: [
			{
				type: 'row',
				fields: [
					{
						name: 'base',
						type: 'select',
						enumName: 'bcbs',
						defaultValue: options.defaultValue,
						required: options.required,
						options: [
							...colorOptions,
							{
								label: 'Custom Color',
								value: 'customColor',
							},
						],
					},
					{
						name: 'custom',
						type: 'text',
						admin: {
							condition: (_, siblingData) => siblingData.base === 'customColor',
							description: 'Fill the color with hex, rgb, or rgba',
						},
					},
				],
			},
		],
	}
}

export const roundedField = (_options?: StyleFieldBase): Field => {
	const options: FieldBase = {
		name: 'rounded',
		..._options,
	}

	const roundedSizeOptions: Option[] = [
		{
			label: 'None',
			value: 'none',
		},
		...sizeOptions,
		{
			label: '2xl',
			value: '2xl',
		},
		{
			label: '3xl',
			value: '3xl',
		},
		{
			label: '4xl',
			value: '4xl',
		},
		{
			label: 'Full',
			value: 'full',
		},
		{
			label: 'Custom',
			value: 'custom',
		},
	]

	return {
		type: 'group',
		name: options.name,
		admin: options.admin,
		index: false,
		fields: [
			{
				name: 'base',
				type: 'select',
				enumName: 'rndbs',
				defaultValue: options.defaultValue,
				required: options.required,
				options: roundedSizeOptions,
			},
			{
				type: 'row',
				admin: {
					condition: (_, siblingData) => siblingData.base === 'custom',
				},
				fields: [
					{
						type: 'group',
						name: 'topLeft',
						admin: {
							width: '25%',
						},
						fields: [
							{
								name: 'base',
								type: 'select',
								enumName: 'rndtlbs',
								options: roundedSizeOptions,
							},
							{
								name: 'custom',
								type: 'text',
								admin: {
									condition: (_, siblingData) => siblingData.base === 'custom',
								},
							},
						],
					},
					{
						type: 'group',
						name: 'topRight',
						admin: {
							width: '25%',
						},
						fields: [
							{
								name: 'base',
								type: 'select',
								enumName: 'rndtrbs',
								options: roundedSizeOptions,
							},
							{
								name: 'custom',
								type: 'text',
								admin: {
									condition: (_, siblingData) => siblingData.base === 'custom',
								},
							},
						],
					},
					{
						type: 'group',
						name: 'bottomLeft',
						admin: {
							width: '25%',
						},
						fields: [
							{
								name: 'base',
								type: 'select',
								enumName: 'rndblbs',
								options: roundedSizeOptions,
							},
							{
								name: 'custom',
								type: 'text',
								admin: {
									condition: (_, siblingData) => siblingData.base === 'custom',
								},
							},
						],
					},
					{
						type: 'group',
						name: 'bottomRight',
						admin: {
							width: '25%',
						},
						fields: [
							{
								name: 'base',
								type: 'select',
								enumName: 'rndbrbs',
								options: roundedSizeOptions,
							},
							{
								name: 'custom',
								type: 'text',
								admin: {
									condition: (_, siblingData) => siblingData.base === 'custom',
								},
							},
						],
					},
				],
			},
		],
	}
}

export const textColorField = (_options?: StyleFieldBase): Field => {
	const options: FieldBase = {
		name: 'textColor',
		..._options,
	}

	return {
		type: 'group',
		name: options.name,
		admin: options.admin,
		index: false,
		fields: [
			{
				type: 'row',
				fields: [
					{
						name: 'base',
						type: 'select',
						enumName: 'tcbs',
						defaultValue: options.defaultValue,
						required: options.required,
						options: [
							{
								label: 'Inherit',
								value: 'inherit',
							},
							{
								label: 'Base Color',
								value: 'base',
							},
							...colorOptions,
							{
								label: 'Custom Color',
								value: 'customColor',
							},
						],
					},
					{
						name: 'custom',
						type: 'text',
						admin: {
							condition: (_, siblingData) => siblingData.base === 'customColor',
							description: 'Fill the color with hex, rgb, or rgba',
						},
					},
				],
			},
		],
	}
}

export const objectFitField = (_options?: StyleFieldBase): Field => {
	const options: FieldBase = {
		name: 'objectFit',
		..._options,
	}

	return {
		type: 'select',
		enumName: 'obfit',
		index: false,
		options: [
			{
				label: 'Cover',
				value: 'cover',
			},
			{
				label: 'Contain',
				value: 'contain',
			},
		],
		...options,
	}
}

export const aspectRatioField = (_options?: StyleFieldBase): Field => {
	const options: FieldBase = {
		name: 'aspectRatio',
		..._options,
	}

	return {
		type: 'select',
		enumName: 'apcrio',
		index: false,
		options: [
			{
				label: '1/1',
				value: '1/1',
			},
			{
				label: '2/1',
				value: '2/1',
			},
			{
				label: '3/2',
				value: '3/2',
			},
			{
				label: '4/3',
				value: '4/3',
			},
			{
				label: '5/3',
				value: '5/3',
			},
			{
				label: '5/4',
				value: '5/4',
			},
			{
				label: '16/9',
				value: '16/9',
			},
			{
				label: '16/10',
				value: '16/10',
			},
		],
		...options,
	}
}

export const styleField = (_options?: {
	field?: Omit<FieldBase, 'name'> & {
		name?: string
	}
	margin?: boolean
	padding?: boolean
	rounded?: boolean
	gap?: boolean
	textColor?: boolean
	backgroundColor?: boolean
	backgroundImage?: boolean
	objectFit?: boolean
	aspectRatio?: boolean
	paddingOptions?: StyleFieldBase
	marginOptions?: StyleFieldBase
	roundedOptions?: StyleFieldBase
	gapOptions?: StyleFieldBase
	textColorOptions?: StyleFieldBase
	backgroundColorOptions?: StyleFieldBase
	backgroundImageOptions?: Omit<StyleFieldBase, 'defaultValue'>
	objectFitOptions?: StyleFieldBase
	aspectRatioOptions?: StyleFieldBase
	prefixFields?: Field[]
	suffixFields?: Field[]
}): Field => {
	const options = {
		width: false,
		height: false,
		padding: false,
		rounded: false,
		gap: false,
		textColor: false,
		backgroundColor: false,
		backgroundImage: false,
		objectFit: false,
		..._options,
	}

	const fields: Field[] = []

	if (options.margin) {
		fields.push(marginField(options.marginOptions))
	}

	if (options.padding) {
		fields.push(paddingField(options.paddingOptions))
	}

	if (options.rounded) {
		fields.push(roundedField(options.roundedOptions))
	}

	if (options.gap) {
		fields.push(gapField(options.gapOptions))
	}

	if (options.textColor) {
		fields.push(textColorField(options.textColorOptions))
	}

	if (options.backgroundColor) {
		fields.push(backgroundColorField(options.backgroundColorOptions))
	}

	if (options.backgroundImage) {
		fields.push(backgroundImageField(options.backgroundImageOptions))
	}

	if (options.objectFit) {
		fields.push(objectFitField(options.objectFitOptions))
	}

	if (options.aspectRatio) {
		fields.push(aspectRatioField(options.aspectRatioOptions))
	}

	return {
		..._options?.field,
		type: 'collapsible',
		label: 'Style',
		admin: {
			initCollapsed: false,
			..._options?.field?.admin,
		},
		fields: [...(options?.prefixFields || []), ...fields, ...(options?.suffixFields || [])],
	}
}
