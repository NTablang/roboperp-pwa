import Head from 'next/head'
import Appbar from '@/components/appbar'
import BottomNav from '@/components/bottom-nav'

interface Props {
	title?: string
	children: React.ReactNode
}

const Page = ({ title, children }: Props) => (
	<>
		{title ? (
			<Head>
				<title>Rice Bowl | {title}</title>
			</Head>
		) : null}

		{/* <Appbar /> */}

		<main
			/**
			 * Padding top = `appbar` height (if it exists, add pt-20)
			 * Padding bottom = `bottom-nav` height
			 */
			className='mx-auto max-w-screen-sm  pb-16 px-safe sm:pb-0'
		>
			<div className='py-6 px-4'>{children}</div>
		</main>

		<BottomNav />
	</>
)

export default Page
