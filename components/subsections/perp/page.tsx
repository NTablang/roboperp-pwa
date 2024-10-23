import React, { useEffect, useState } from 'react'
import {
	useSimplePerp,
	useMarketUpdates,
	SimplePerpWithDelta,
} from '@/components/hooks/useFirebaseData'
import PrettyDump from '@/components/PrettyDump'
import moment from 'moment'
import FullStats from './FullStats'
import PerpHeader from './PerpHeader'
import PriceChart from './PriceChart'
import TimeRangeSelector from './TimeRangeSelector'
import DataVerifiabilityInfo from './DataVerifiabilityInfo'
import MarketSentiment from './MarketSentiment'
import { parseEther, formatEther } from 'ethers'
import SplashScreen from '@/components/SplashScreen'
import { useSplashScreen } from '@/hooks/useSplashScreen'

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
	const [availableRanges, setAvailableRanges] = useState<TimeRange[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const showSplash = useSplashScreen()

	useEffect(() => {
		if (!marketUpdateData || marketUpdateData.length <= 1) {
			setSelectedTimeRange('1D')
			console.log('marketUpdateData is not ready yet')
			setAvailableRanges([])
			setChartData(null)
			setOpenInterestChartData(null)
			return
		}

		const now = moment()
		const ranges: TimeRange[] = []

		const hasDataForRange = (range: TimeRange) => {
			return marketUpdateData.some((update: any) => {
				const updateTime = moment.unix(parseInt(update.mockedTimestamp))
				switch (range) {
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
		}

		;(['1H', '1D', '1W', '∞'] as TimeRange[]).forEach((range) => {
			if (hasDataForRange(range)) {
				ranges.push(range)
			}
		})

		setAvailableRanges(ranges)

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

		if (filteredData.length < 2) {
			console.log('Not enough data for the selected time range')
			return
		}

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
		const currentOpenInterest = parseFloat(formatEther(latestUpdate.totalOI))
		const previousOpenInterest = parseFloat(formatEther(earliestUpdate.totalOI))

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
			const totalOI = parseFloat(formatEther(latestUpdate.totalOI))
			const netOI = parseFloat(formatEther(latestUpdate.netOI))

			const longOI = (totalOI + netOI) / 2
			const shortOI = (totalOI - netOI) / 2

			setOpenInterest({
				long: longOI,
				short: shortOI,
			})
		}

		const labels = filteredData
			.map((update: any) =>
				moment.unix(parseInt(update.mockedTimestamp)).format('MM/DD HH:mm'),
			)
			.reverse()

		const shortOIData = filteredData
			.map((update: any) => {
				const totalOI = parseEther(update.totalOI)
				const netOI = parseEther(update.netOI)
				return Number((totalOI - netOI) / BigInt(2)) / 1e18
			})
			.reverse()

		const longOIData = filteredData
			.map((update: any) => {
				const totalOI = parseEther(update.totalOI)
				const netOI = parseEther(update.netOI)
				return Number((totalOI + netOI) / BigInt(2)) / 1e18
			})
			.reverse()

		setOpenInterestChartData({
			labels,
			datasets: [
				{
					label: 'Long Open Interest',
					data: longOIData,
					backgroundColor: (context: any) => {
						const chart = context.chart
						const { ctx, chartArea } = chart
						if (!chartArea) {
							return '#FFAB00'
						}
						const gradient = ctx.createLinearGradient(
							0,
							chartArea.bottom,
							0,
							chartArea.top,
						)
						gradient.addColorStop(0, '#FFAB00')
						gradient.addColorStop(1, '#FFD572')
						return gradient
					},
				},
				{
					label: 'Short Open Interest',
					data: shortOIData,
					backgroundColor: (context: any) => {
						const chart = context.chart
						const { ctx, chartArea } = chart
						if (!chartArea) {
							return '#F25F33'
						}
						const gradient = ctx.createLinearGradient(
							0,
							chartArea.bottom,
							0,
							chartArea.top,
						)
						gradient.addColorStop(0, '#F25F33')
						gradient.addColorStop(1, '#FF9364')
						return gradient
					},
				},
			],
		})
	}, [marketUpdateData, selectedTimeRange])

	useEffect(() => {
		if (!isLoadingSimplePerp && !isLoadingMarketUpdates) {
			// Add a small delay to ensure smooth transition
			setTimeout(() => setIsLoading(false), 500)
		}
	}, [isLoadingSimplePerp, isLoadingMarketUpdates])

	const handleTimeRangeChange = (range: TimeRange) => {
		setSelectedTimeRange(range)
		setChartData(null)
		setOpenInterestChartData(null)
	}

	if (showSplash) {
		return <SplashScreen />
	}
	if (isLoadingSimplePerp || isLoadingMarketUpdates) {
		console.log('Loading data...')
		return <div>Loading...</div>
	}
	if (isErrorSimplePerp || isErrorMarketUpdates) {
		console.error(
			'Error loading data:',
			isErrorSimplePerp || isErrorMarketUpdates,
		)
		return (
			<div>
				Error loading data
				<PrettyDump data={isErrorSimplePerp || isErrorMarketUpdates} />
			</div>
		)
	}

	const calculatedMarkPrice =
		Number(simplePerpData?.markPrice) / Math.pow(10, 6)

	return (
		<div>
			{/*
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
			*/}

			<PerpHeader
				simplePerpData={simplePerpData}
				delta={delta}
				marketUpdateData={marketUpdateData}
			/>

			{chartData && <PriceChart chartData={chartData} />}

			<TimeRangeSelector
				selectedTimeRange={selectedTimeRange}
				onTimeRangeChange={handleTimeRangeChange}
				availableRanges={availableRanges}
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
