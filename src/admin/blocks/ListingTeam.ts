import type { Block } from 'payload'

import { styleField } from '$payload-fields/style'
import { teamGender, teamLevel } from '$payload-libs/enum'

export const ListingTeamBlock: Block = {
	slug: 'listingTeam',
	dbName: (args) => {
		if (args.tableName) {
			return args.tableName + '_ltb'
		}

		return 'ltb'
	},
	imageURL: '/blocks/listing-team.jpg',
	fields: [
		{
			name: 'type',
			type: 'select',
			enumName: 'ltbtyp',
			options: [
				{
					label: 'Teams',
					value: 'teams',
				},
				{
					label: 'Selected Teams',
					value: 'selectedTeams',
				},
				{
					label: 'Selected Positions',
					value: 'selectedPositions',
				},
				{
					label: 'Selected Gender',
					value: 'selectedGender',
				},
				{
					label: 'Selected Level',
					value: 'selectedLevels',
				},
				{
					label: 'Search',
					value: 'search',
				},
			],
		},
		{
			name: 'selectedTeams',
			type: 'relationship',
			relationTo: 'teams',
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedTeams',
			},
		},
		{
			name: 'selectedPositions',
			type: 'relationship',
			relationTo: 'teamPositions',
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedPositions',
			},
		},
		{
			type: 'select',
			name: 'selectedGender',
			enumName: 'ltbsgndr',
			options: teamGender,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedGender',
			},
		},
		{
			type: 'select',
			name: 'selectedLevels',
			enumName: 'ltbslvl',
			options: teamLevel,
			hasMany: true,
			admin: {
				condition: (_, siblingData) => siblingData.type === 'selectedLevels',
			},
		},
		{
			name: 'search',
			type: 'text',
			admin: {
				condition: (_, siblingData) => siblingData.type === 'search',
			},
		},
		{
			type: 'row',
			admin: {
				condition: (_, siblingData) => siblingData.type !== 'selectedTeams',
			},
			fields: [
				{
					name: 'order',
					type: 'select',
					enumName: 'ltbor',
					admin: {
						width: '33.333%',
					},
					options: [
						{
							label: 'DESC',
							value: 'DESC',
						},
						{
							label: 'ASC',
							value: 'ASC',
						},
					],
				},
				{
					name: 'orderBy',
					type: 'select',
					enumName: 'ltborby',
					admin: {
						width: '33.333%',
					},
					options: [
						{
							label: 'Date',
							value: 'date',
						},
						{
							label: 'Title',
							value: 'title',
						},
					],
				},
				{
					name: 'total',
					type: 'number',
					min: 1,
					admin: {
						width: '33.333%',
					},
				},
			],
		},
		{
			type: 'row',
			admin: {
				condition: (_, siblingData) => siblingData.type !== 'selectedTeams',
			},
			fields: [
				{
					type: 'checkbox',
					name: 'showFilter',
					admin: {
						width: '50%',
					},
				},
				{
					type: 'select',
					name: 'pagination',
					enumName: 'ltbpgn',
					admin: {
						width: '50%',
					},
					options: [
						{
							label: 'None',
							value: 'none',
						},
						{
							label: 'Paged',
							value: 'paged',
						},
						{
							label: 'Load More',
							value: 'load-more',
						},
						{
							label: 'Infinite Scroll',
							value: 'infinite-scroll',
						},
					],
				},
			],
		},
		styleField({
			gap: true,
			prefixFields: [
				{
					name: 'column',
					type: 'number',
					min: 1,
				},
			],
		}),
	],
}
