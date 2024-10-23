import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChartArrow from '@/public/chart-arrow.svg'
import clsx from 'clsx'
import Image from 'next/image'

const TradeButton: React.FC = () => {
	const [isBlurred, setIsBlurred] = useState(false)
	const [showButtons, setShowButtons] = useState(false)

	const handleMainButtonClick = () => {
		if (showButtons) {
			// If buttons are shown, clicking will close them
			handleClose()
		} else {
			// If buttons are not shown, clicking will show them
			setIsBlurred(true)
			setShowButtons(true)
			//      setTimeout(() => setShowButtons(true), 250);
		}
	}

	const handleClose = () => {
		setShowButtons(false)
		setIsBlurred(false)
	}

	return (
		<>
			<AnimatePresence>
				{isBlurred && (
					<motion.div
						className='fixed inset-0 bg-white/30 backdrop-blur-sm z-10'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
					/>
				)}
			</AnimatePresence>

			<div className='relative w-full h-full flex items-center justify-center'>
				<motion.button
					className={clsx(
						'z-20 px-36 py-4 text-white rounded-full text-lg font-[600] transition-all duration-200',
						showButtons
							? 'bg-white !text-black !border-black !border'
							: 'bg-gradient-to-b from-[#717171] to-black',
					)}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleMainButtonClick}
					initial={false}
				>
					{showButtons ? '✕' : 'Trade'}
				</motion.button>

				<AnimatePresence>
					{showButtons && (
						<motion.div
							className='fixed bottom-6 right-6 flex flex-col space-y-4 z-30'
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: -75 }}
							exit={{ opacity: 0, y: 50 }}
							transition={{ duration: 0.25 }}
						>
							<motion.button
								className='px-20 py-4 bg-black text-white rounded-full text-lg font-semibold flex items-center justify-center gap-2'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<div>Bearish</div>
								<Image src={ChartArrow} alt='Bearish' width={20} height={20} className='transform rotate-180 scale-x-[-1]' />
							</motion.button>
							<motion.button
								className='px-20 py-4 bg-black text-white rounded-full text-lg font-semibold flex items-center justify-center gap-2'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<div>Bullish</div>
								<Image src={ChartArrow} alt='Bullish' width={20} height={20} />
							</motion.button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	)
}

export default TradeButton
