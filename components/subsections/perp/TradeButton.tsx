import React, { useState, useCallback } from 'react'
import clsx from 'clsx'
import styles from './TradeButton.module.css'
import ChartArrow from '@/public/chart-arrow.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'

const TradeButton: React.FC<{ address: string }> = ({ address }) => {
	const router = useRouter()
	const [isBlurred, setIsBlurred] = useState(false)
	const [showButtons, setShowButtons] = useState(false)
	const [isClosing, setIsClosing] = useState(false)

	const vibrate = useCallback((pattern: number | number[]) => {
		if (navigator.vibrate) {
			navigator.vibrate(pattern);
		}
	}, []);

	const handleMainButtonClick = useCallback(() => {
		if (showButtons) {
			handleClose()
		} else {
			vibrate([100, 30, 100, 30, 100]);
			setIsBlurred(true)
			setShowButtons(true)
		}
	}, [showButtons, vibrate]);

	const handleClose = useCallback(() => {
		setIsClosing(true)
		setTimeout(() => {
			setShowButtons(false)
			setIsBlurred(false)
			setIsClosing(false)
		}, 250) // Match this with the animation duration
	}, []);

	const handleBearishBullishClick = useCallback((direction: 'bearish' | 'bullish') => {
		vibrate([50, 20, 50]);

		// add bearish/bullish as part of param on router
		router.push(`/trade/${address}?direction=${direction}`);
	}, [vibrate, router, address]);

	return (
		<>
			{isBlurred && (
				<div className={styles.blur} />
			)}

			<div className={styles.container}>
				<button
					className={clsx(
						styles.mainButton,
						showButtons ? styles.mainButtonOpen : styles.mainButtonClosed
					)}
					onClick={handleMainButtonClick}
				>
					<span className={clsx(
						styles.buttonText,
						showButtons ? styles.closeText : styles.tradeText
					)}>
						{showButtons ? "✕" : "Trade"}
					</span>
				</button>

				{(showButtons || isClosing) && (
					<div className={clsx(
						styles.buttonContainer,
						isClosing && styles.buttonContainerClosing
					)}>
						<button
							className={styles.actionButton}
							onClick={() => handleBearishBullishClick('bearish')}
						>
							<div>Bearish</div>
							<Image src={ChartArrow} alt="Bearish" className="transform rotate-[180deg] scale-x-[-1]"/>
						</button>
						<button
							className={styles.actionButton}
							onClick={() => handleBearishBullishClick('bullish')}
						>
							<div>Bullish</div>
							<Image src={ChartArrow} alt="Bullish" />
						</button>
					</div>
				)}
			</div>
		</>
	)
}

export default TradeButton
