import React, { useEffect, useState } from 'react'
import {
	useSimplePerp,
	useMarketUpdates,
	SimplePerpWithDelta
} from '@/components/hooks/useFirebaseData'
import PrettyDump from '@/components/PrettyDump'
import moment from 'moment'
import FullStats from './FullStats'
import PerpHeader from './PerpHeader'
import PriceChart from './PriceChart'
import TimeRangeSelector from './TimeRangeSelector'
import DataVerifiabilityInfo from './DataVerifiabilityInfo'
import MarketSentiment from './MarketSentiment'


export type TimeRange = '1H' | '1D' | '1W' | '∞'

function InDepthPerpSection({ address }: { address: string }) {
	const {
		data: simplePerpData,
		isLoading: isLoadingSimplePerp,
		isError: isErrorSimplePerp,
	} = useSimplePerp(address)
	const {
		data: marketUpdateData,
		isLoading: isLoadingMarketUpdates,
		isError: isErrorMarketUpdates,
	} = useMarketUpdates(address)

	const [chartData, setChartData] = useState<any>(null)
	const [delta, setDelta] = useState<{
		markPrice: number
		fundingRate: number
		openInterest: number
		lastUpdateTime: moment.Moment | null
	} | null>(null)
	const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('1H')
	const [openInterest, setOpenInterest] = useState<{
		long: number
		short: number
	} | null>(null)
	const [openInterestChartData, setOpenInterestChartData] = useState<any>(null)

	useEffect(() => {
		if (marketUpdateData && marketUpdateData.length > 1) {
			const now = moment()
			const filteredData = marketUpdateData.filter((update: any) => {
				const updateTime = moment.unix(parseInt(update.mockedTimestamp))
				switch (selectedTimeRange) {
					case '1H':
						return now.diff(updateTime, 'hours') <= 1
					case '1D':
						return now.diff(updateTime, 'days') <= 1
					case '1W':
						return now.diff(updateTime, 'weeks') <= 1
					case '∞':
						return true
				}
			})

			if (filteredData.length < 2) return

			const latestUpdate = filteredData[0]
			const earliestUpdate = filteredData[filteredData.length - 1]

			const currentMarkPrice =
				parseFloat(latestUpdate.markPrice) / Math.pow(10, 6)
			const previousMarkPrice =
				parseFloat(earliestUpdate.markPrice) / Math.pow(10, 6)
			const currentFundingRate =
				parseFloat(latestUpdate.fundingRate) / (Math.pow(10, 18) * 3600)
			const previousFundingRate =
				parseFloat(earliestUpdate.fundingRate) / (Math.pow(10, 18) * 3600)
			const currentOpenInterest =
				parseFloat(latestUpdate.totalOI) / Math.pow(10, 18)
			const previousOpenInterest =
				parseFloat(earliestUpdate.totalOI) / Math.pow(10, 18)

			setDelta({
				markPrice: currentMarkPrice - previousMarkPrice,
				fundingRate: currentFundingRate - previousFundingRate,
				openInterest: currentOpenInterest - previousOpenInterest,
				lastUpdateTime: moment.unix(parseInt(latestUpdate.mockedTimestamp)),
			})

			setChartData({
				labels: filteredData
					.map((update: any) =>
						moment.unix(parseInt(update.mockedTimestamp)).format('MM/DD HH:mm'),
					)
					.reverse(),
				datasets: [
					{
						label: 'Mark Price',
						data: filteredData
							.map(
								(update: any) => parseFloat(update.markPrice) / Math.pow(10, 6),
							)
							.reverse(),
						borderColor: '#F8A700',
						borderWidth: 2,
						pointRadius: 0, // Remove points
						tension: 0, // Add some curve to the line
					},
				],
			})

			if (filteredData.length > 0) {
				const totalOI = parseFloat(latestUpdate.totalOI)
				const netOI = parseFloat(latestUpdate.netOI) / Math.pow(10, 18)

				const longOI = (totalOI + netOI) / 2
				const shortOI = (totalOI - netOI) / 2


				setOpenInterest({
					long: longOI,
					short: shortOI,
				})
			}

			const labels = filteredData.map((update: any) =>
				moment.unix(parseInt(update.mockedTimestamp)).format('MM/DD HH:mm'),
			)

			const shortOIData = filteredData.map((update: any) => {
				const totalOI = parseFloat(update.totalOI) / Math.pow(10, 18)
				const netOI = parseFloat(update.netOI) / Math.pow(10, 18)
				return (totalOI - netOI) / 2
			})

			const longOIData = filteredData.map((update: any) => {
				const totalOI = parseFloat(update.totalOI) / Math.pow(10, 18)
				const netOI = parseFloat(update.netOI) / Math.pow(10, 18)
				return (totalOI + netOI) / 2
			})

			setOpenInterestChartData({
				labels,
				datasets: [
					{
						label: 'Short Open Interest',
						data: shortOIData,
						backgroundColor: 'rgba(255, 99, 132, 0.8)',
					},
					{
						label: 'Long Open Interest',
						data: longOIData,
						backgroundColor: 'rgba(255, 206, 86, 0.8)',
					},
				],
			})
		}
	}, [marketUpdateData, selectedTimeRange])

	const handleTimeRangeChange = (range: TimeRange) => {
		setSelectedTimeRange(range)
	}

	if (isLoadingSimplePerp || isLoadingMarketUpdates)
		return <div>Loading...</div>
	if (isErrorSimplePerp || isErrorMarketUpdates)
		return <div>Error loading data</div>

	return (
		<div>
			<div>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth='2'
					stroke='#9B9B9B'
					className='size-6'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M15.75 19.5 8.25 12l7.5-7.5'
					/>
				</svg>
			</div>

			<PerpHeader
				simplePerpData={simplePerpData}
				delta={delta}
				marketUpdateData={marketUpdateData}
			/>

			<PriceChart chartData={chartData} />

			<TimeRangeSelector
				selectedTimeRange={selectedTimeRange}
				onTimeRangeChange={handleTimeRangeChange}
			/>

			<DataVerifiabilityInfo />

			<MarketSentiment openInterestChartData={openInterestChartData} />

			<FullStats
				data={simplePerpData as SimplePerpWithDelta}
				openInterest={openInterest || { long: 0, short: 0 }}
			/>

			<PrettyDump data={simplePerpData} />
			<div>market updates</div>
			<PrettyDump data={marketUpdateData} />
		</div>
	)
}

export default InDepthPerpSection
