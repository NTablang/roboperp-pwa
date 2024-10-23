import Page from '@/components/page'
import Section from '@/components/section'
import InDepthPerpSection from '@/components/subsections/perp/page'
import TradeButton from '@/components/subsections/perp/TradeButton'

const Index = () => (
	<Page>
		<Section>
			<InDepthPerpSection
				address={'0x729f4b99E3ADd91d450962ee4F49623382c9A3A0'}
			/>
			<div className='fixed bottom-0 left-0 w-screen bg-white flex items-center justify-center py-6'>
				<TradeButton />
			</div>
		</Section>
	</Page>
)

export default Index
