import React, { useState, useMemo } from 'react'
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

	const mainButtonClass = useMemo(() =>
		clsx(
			'z-20 px-36 py-4 text-white rounded-full text-lg font-[600] transition-all duration-200 will-change-transform',
			showButtons ? 'bg-white !text-black !border-black !border !px-[10rem]' : 'bg-gradient-to-b from-[#717171] to-black'
		),
	[showButtons]);

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
					className={mainButtonClass}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleMainButtonClick}
					layout
				>
					<AnimatePresence mode="popLayout">
						{showButtons ? (
							<motion.span
								key="close"
								initial={{ opacity: 0, rotate: -90 }}
								animate={{ opacity: 1, rotate: 0 }}
								exit={{ opacity: 0, rotate: 90 }}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 15,
									opacity: { duration: 0.1 }
								}}
							>
								✕
							</motion.span>
						) : (
							<motion.span
								key="trade"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }} // Faster opacity transition
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
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
						>
							<motion.button
								className='px-20 py-4 bg-black text-white rounded-full text-lg font-semibold will-change-transform'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleBearishBullishClick}
								layout
							>
								Bearish
							</motion.button>
							<motion.button
								className='px-20 py-4 bg-black text-white rounded-full text-lg font-semibold will-change-transform'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleBearishBullishClick}
								layout
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
