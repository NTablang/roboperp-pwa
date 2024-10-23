import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'
import { NavigationProvider } from '../components/NavigationContext'
import PageTransition from '@/components/PageTransition'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<NavigationProvider>
			<PageTransition>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					disableTransitionOnChange
				>
					<Component {...pageProps} />
				</ThemeProvider>
			</PageTransition>
		</NavigationProvider>
	)
}

export default MyApp
