import { usePositions, useSimplePerp } from '@/components/hooks/useFirebaseData'
import React, { useEffect } from 'react'

interface SimplePerpDetailsProps {
	address: string
}

const SimplePerpDetails: React.FC<SimplePerpDetailsProps> = ({ address }) => {
	const {
		data: simplePerpData,
		isLoading: isLoadingSimplePerp,
		isError: isErrorSimplePerp,
	} = useSimplePerp(address)
	const {
		data: positions,
		isLoading: isLoadingPositions,
		isError: isErrorPositions,
	} = usePositions(address)



	if (isLoadingSimplePerp || isLoadingPositions) return <div>Loading...</div>
	if (isErrorSimplePerp || isErrorPositions)
		return <div>Error fetching data</div>

	return (
		<div>
			<h2>SimplePerp Details</h2>
			<p>Funding Rate: {simplePerpData?.fundingRate}</p>
			<p>Mark Price: {simplePerpData?.markPrice}</p>
			<p>Net Open Interest: {simplePerpData?.netOpenInterest}</p>
			<p>Total Open Interest: {simplePerpData?.totalOpenInterest}</p>

			<pre className='border mt-20'>
				<h3>Positions</h3>
				{positions?.map((position) => (
					<div key={position.id}>
						<p>Holder: {position.holder}</p>
						<p>Collateral: {position.collateral}</p>
						<p>Quantity: {position.quantity}</p>
						<p>Leverage: {position.leverage}</p>
					</div>
				))}
			</pre>
		</div>
	)
}

export default SimplePerpDetails
