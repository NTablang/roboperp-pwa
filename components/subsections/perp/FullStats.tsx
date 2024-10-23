import React from 'react'
import moment from 'moment'
import { SimplePerpWithDelta } from '@/components/hooks/useFirebaseData'
import { formatEther } from 'ethers'

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

			<div className='w-full flex flex-col tracking-tight'>
				<StatRow
					label="Mark Price"
					value={`$${formatNumber((Number(data.markPrice) / Math.pow(10, 6)).toString(), 6)}`}
				/>
				<StatRow
					label="Funding Rate"
					value={formatEther(data.fundingRate)}
				/>
				<StatRow
					label="Ticker"
					value={data.metadata.ticker}
				/>
				<StatRow
					label="Title"
					value={data.metadata.title}
				/>
				<StatRow
					label="Description"
					value={data.metadata.description}
					valueClassName="text-xs"
				/>
				<StatRow
					label="Cumulative Funding"
					value={`$${formatNumber((Number(data.markPrice) / Math.pow(10, 6)).toString(), 6)}`}
				/>
				<StatRow
					label="Total Open Interest"
					value={data.totalOpenInterest}
				/>
				<StatRow
					label="Total Positions"
					value={formatNumber(data.totalPositions, 0) || '0'}
				/>
				<StatRow
					label="Last Funding Update"
					value={(moment.unix(parseInt(data.lastFundingUpdate)).fromNow())}
				/>

				<StatRow
					label="Net Open Interest"
					value={data.netOpenInterest}
				/>
				<div className='flex justify-between py-2 border-b border-black text-xs'>
					SC: <strong>{data.perpSmartContractAddress}</strong>
				</div>
			</div>
		</div>
	)
}

interface StatRowProps {
	label: string
	value: string | number
	valueClassName?: string
}

function StatRow({ label, value, valueClassName = '' }: StatRowProps) {
	return (
		<div className='flex justify-between py-2 border-b border-black'>
			<div className='font-[400] text-normal-black text-opacity-[75%] whitespace-nowrap'>{label}</div>
			<div className={`text-right font-[600] text-normal-black  ${valueClassName}`}>
				{value}
			</div>
		</div>
	)
}

export default FullStats
