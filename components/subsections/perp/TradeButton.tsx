import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChartArrow from '@/public/chart-arrow.svg'
import clsx from 'clsx'
import Image from 'next/image'

const TradeButton: React.FC = () => {
	const [isBlurred, setIsBlurred] = useState(false)
	const [showButtons, setShowButtons] = useState(false)

	const vibrate = (pattern: number | number[]) => {
		if (navigator.vibrate) {
			navigator.vibrate(pattern);
		}
	};

	const handleMainButtonClick = () => {
		if (showButtons) {
			// If buttons are shown, clicking will close them
			handleClose()
		} else {
			// Loud haptic feedback
			vibrate([100, 30, 100, 30, 100]);
			setIsBlurred(true)
			setShowButtons(true)
		}
	};

	const handleClose = () => {
		setShowButtons(false)
		setIsBlurred(false)
	};

	const handleBearishBullishClick = () => {
		// Semi-loud haptic feedback
		vibrate([50, 20, 50]);
	};

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
					<AnimatePresence mode="wait">
						{showButtons ? (
							<motion.span
								key="close"
								initial={{ rotate: -90 }}
								animate={{ rotate: 0 }}
								exit={{ rotate: 90 }}
								transition={{ duration: 0.2 }}
							>
								✕
							</motion.span>
						) : (
							<motion.span
								key="trade"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								Trade
							</motion.span>
						)}
					</AnimatePresence>
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
								className='px-20 py-4 bg-black text-white rounded-full text-lg font-semibold'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleBearishBullishClick}
							>
								Bearish
							</motion.button>
							<motion.button
								className='px-20 py-4 bg-black text-white rounded-full text-lg font-semibold'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleBearishBullishClick}
							>
								Bullish
							</motion.button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	)
}

export default TradeButton
