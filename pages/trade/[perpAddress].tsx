import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Page from '@/components/page'
import Section from '@/components/section'
import ChartArrow from '@/public/chart-arrow.svg'
import Image from 'next/image'
import PencilIcon from '@/public/pencil.svg'
import clsx from 'clsx'
import PageWrapper from '@/components/PageWrapper'
import { useNavigation } from '@/components/NavigationContext'

function TradePage() {
	const router = useRouter()
	const { perpAddress, direction } = router.query
	const { triggerTransition } = useNavigation()

	const [tradeDetails, setTradeDetails] = useState({
		amount: '1',
		leverage: '5x',
		collateral: '$100'
	})

	const handleBack = () => {
		triggerTransition('/')
	}

	const handleSubmit = () => {
		// Add your submit logic here
		console.log('Submit button clicked', tradeDetails)
	}

	const handleTradeDetailUpdate = (key: keyof typeof tradeDetails, value: string) => {
		setTradeDetails(prev => ({ ...prev, [key]: value }))
	}

	return (
		<PageWrapper>
			<Page>
				<div className="flex flex-col min-h-screen">
					<Section>
						<div className='flex items-center justify-between'>
							<button onClick={handleBack}>
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
							</button>
							<div className='flex items-center justify-center w-full  fixed top-5 left-0 right-0'>
								<div className='flex items-center gap-2'>
									<div className='font-[600] tracking-[-0.02em] text-black'>
										{direction === 'bearish' ? 'Bearish' : 'Bullish'}
									</div>
									<Image
										src={ChartArrow}
										alt='Bearish'
										className={clsx(
											direction === 'bearish' ? 'transform rotate-[180deg] scale-x-[-1] invert' : 'rotate-[0deg] invert'
										)}
										width={16}
										height={16}
									/>
								</div>
							</div>
						</div>
						<div className='flex flex-col justify-center w-full mt-8 gap-2'>
							<div className='text-2xl font-[500] tracking-[-0.02em] text-normal-black'>
								The Dreamer
							</div>
							<div className='text-sm font-[300] tracking-[-0.02em] text-normal-black pr-20'>
								This high risk, high reward has suggested a following markup profile
							</div>
							<div className='flex flex-col gap-2 justify-center px-3 py-3 border-opacity-5 border border-black bg-[#F5F5F5] rounded-2xl mt-4'>
								<EditableStatRow
									label='Amount'
									value={tradeDetails.amount}
									onSave={(value) => handleTradeDetailUpdate('amount', value)}
								/>
								<EditableStatRow
									label='Leverage'
									value={tradeDetails.leverage}
									onSave={(value) => handleTradeDetailUpdate('leverage', value)}
								/>
								<EditableStatRow
									label='Collateral'
									value={tradeDetails.collateral}
									includeBorder={false}
									onSave={(value) => handleTradeDetailUpdate('collateral', value)}
								/>
								<div className='flex justify-between bg-white rounded-lg p-4 mt-2'>
									<div className='text-base font-[400] tracking-[-0.02em] text-normal-black text-opacity-[75%]'>
										Total
									</div>
									<div className='text-base font-[700] tracking-[-0.02em] text-normal-black'>
										$46.95
									</div>
								</div>
								<div className='text-right text-sm text-normal-black opacity-[45%] tracking-tight'>
									$0.20 trading fee
								</div>
							</div>
						</div>
					</Section>
					<div className="px-8 py-6 bg-white fixed bottom-3 w-full left-0">
						<button
							onClick={handleSubmit}
							className={clsx(
								'w-full bg-black text-white py-4 rounded-full font-semibold text-lg',
								'transition-all duration-200 ease-in-out',
								'hover:bg-gray-800 active:bg-gray-700 active:scale-95',
								'focus:outline-none',
								'touch-action-manipulation',
								'[&_*]:pointer-events-none'
							)}
							style={{
								WebkitTapHighlightColor: 'transparent',
							}}
						>
							Submit
						</button>
					</div>
				</div>
			</Page>
		</PageWrapper>
	)
}

function EditableStatRow({
	label,
	value,
	includeBorder = true,
	onSave,
}: {
	label: string
	value: string
	includeBorder?: boolean
	onSave: (value: string) => void
}) {
	const [isEditing, setIsEditing] = useState(false)
	const [editedValue, setEditedValue] = useState(value)

	const handleEdit = () => {
		setIsEditing(true)
		setEditedValue(value)
	}

	const handleSave = () => {
		setIsEditing(false)
		onSave(editedValue)
	}

	const handleCancel = () => {
		setIsEditing(false)
		setEditedValue(value)
	}

	return (
		<div
			className={clsx(
				'flex justify-between pb-1 border-opacity-30 tracking-tighter',
				includeBorder ? 'border-b border-black' : '',
			)}
		>
			<div className='text-sm font-[400] tracking-[-0.02em] text-normal-black text-opacity-[75%]'>
				{label}
			</div>
			{isEditing ? (
				<div className='flex items-center gap-2'>
					<input
						type="text"
						value={editedValue}
						onChange={(e) => setEditedValue(e.target.value)}
						className='text-sm font-[700] tracking-[-0.02em] text-normal-black bg-white border border-gray-300 rounded px-2 py-1 w-20'
					/>
					<button onClick={handleSave} className='text-blue-500'>
						Save
					</button>
					<button onClick={handleCancel} className='text-red-500'>
						Cancel
					</button>
				</div>
			) : (
				<div className='text-sm font-[700] tracking-[-0.02em] text-normal-black flex items-center gap-1'>
					<button onClick={handleEdit}>
						<Image
							src={PencilIcon}
							alt='Edit'
							width={12}
							height={12}
							className='opacity-70'
						/>
					</button>
					<div>{value}</div>
				</div>
			)}
		</div>
	)
}

export default TradePage
