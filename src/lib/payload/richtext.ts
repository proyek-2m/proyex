import {
	BlocksFeature,
	type BlocksFeatureProps,
	FixedToolbarFeature,
	lexicalEditor,
	EXPERIMENTAL_TableFeature as TableFeature,
} from '@payloadcms/richtext-lexical'

export const richTextEditor = (props?: { blockFeatures?: BlocksFeatureProps }) => {
	return lexicalEditor({
		features: ({ defaultFeatures }) => {
			const features = [...defaultFeatures, FixedToolbarFeature(), TableFeature()]

			if (props?.blockFeatures) {
				features.push(BlocksFeature(props.blockFeatures))
			}

			return features
		},
	})
}

export const richTextBasic = () =>
	lexicalEditor({
		features: ({ defaultFeatures }) => {
			const features = defaultFeatures.filter((feature) =>
				['bold', 'italic', 'underline', 'strikethrough'].includes(feature.key),
			)

			features.push(FixedToolbarFeature())

			return features
		},
	})
