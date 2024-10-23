import Page from '@/components/page'
import Section from '@/components/section'
import InDepthPerpSection from '@/components/subsections/perp/page'
import SimplePerpDetails from '@/components/subsections/perp/SimplePerpDetails'

const Index = () => (
	<Page>
		<Section>
			<InDepthPerpSection  address={"0x729f4b99E3ADd91d450962ee4F49623382c9A3A0"}/>
			<div className='fixed bottom-0 left-0 w-screen  bg-white flex items-center justify-center py-6 '>
				<div className='trade-button flex justify-center items-center px-36 py-4 text-white font-[600] text-xl tracking-tight'>
					<div>Trade</div>

				</div>
			</div>
		</Section>
	</Page>
)

export default Index
