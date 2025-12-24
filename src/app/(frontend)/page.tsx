import PageTemplate, { generateMetadata } from './[...slug]/page'

export const dynamic = 'force-static'
export const revalidate = 2592000

export default PageTemplate

export { generateMetadata }
