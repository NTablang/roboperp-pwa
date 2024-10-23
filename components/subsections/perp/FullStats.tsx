import React from 'react'
import moment from 'moment'
import { SimplePerpWithDelta } from '@/components/hooks/useFirebaseData'

interface FullStatsProps {
	data: SimplePerpWithDelta
	openInterest: {
		long: number
		short: number
	}
}

function FullStats({ data, openInterest }: FullStatsProps) {
	const formatNumber = (value: string | undefined, decimals: number = 2) => {
		if (!value) return '0'
		const num = parseFloat(value)
		return num.toLocaleString(undefined, {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		})
	}

	const formatDollar = (value: string | undefined) =>
		value ? `$${formatNumber(value)}` : '$0'

	const formatPercentage = (value: string | undefined) =>
		value ? `${formatNumber(value, 4)}%` : '0%'

	return (
		<div className='mt-8 w-full'>
			<h2 className='text-2xl font-bold mb-4'>Full Stats</h2>

			<div className='w-full flex flex-col'>
				<div className='flex justify-between py-2 border-b'>
					<div>Mark Price</div>
					<div className='text-right'>
						${formatNumber((Number(data.markPrice) / Math.pow(10, 6)).toString(), 6)}
					</div>
				</div>
				<div className='flex justify-between py-2 border-b'>
					<div>Funding Rate</div>
					<div className='text-right'>{formatPercentage(data.fundingRate)}</div>
				</div>
				<div className='flex justify-between py-2 border-b'>
					<div>Ticker</div>
					<div className='text-right'>{data.metadata.ticker}</div>
				</div>
				<div className='flex justify-between py-2 border-b'>
					<div>Title</div>
					<div className='text-right'>{data.metadata.title}</div>
				</div>
				<div className='flex justify-between py-2 border-b'>
					<div>Description</div>
					<div className='text-right text-xs'>{data.metadata.description}</div>
				</div>
				<div className='flex justify-between py-2 border-b'>
					<div>Mark Price</div>
					<div className='text-right'>{formatDollar(data.markPrice)}</div>
				</div>

				<div className='flex justify-between py-2 border-b'>
					<div>Cumulative Funding</div>
					<div className='text-right'>
						${formatNumber((Number(data.markPrice) / Math.pow(10, 6)).toString(), 6)}
					</div>
				</div>
				<div className='flex justify-between py-2 border-b'>
					<div>Total Open Interest</div>
					<div className='text-right'>{data.totalOpenInterest}</div>
				</div>
				<div className='flex justify-between py-2 border-b'>
					<div>Total Positions</div>
					<div className='text-right'>{data.totalPositions}</div>
				</div>
				<div className='flex justify-between py-2 border-b'>
					<div>Last Funding Update</div>
					<div className='text-right'>
						{moment(parseInt(data.lastFundingUpdate)).fromNow()}
					</div>
				</div>
				<div className='flex justify-between py-2 border-b'>
					<div>Net Open Interest</div>
					<div className='text-right'>{data.netOpenInterest}</div>
				</div>
			</div>
		</div>
	)
}

export default FullStats
