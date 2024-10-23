import React, { useState, useCallback } from 'react'
import clsx from 'clsx'
import styles from './TradeButton.module.css'
import ChartArrow from '@/public/chart-arrow.svg'
import Image from 'next/image'

const TradeButton: React.FC = () => {
	const [isBlurred, setIsBlurred] = useState(false)
	const [showButtons, setShowButtons] = useState(false)

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
		setShowButtons(false)
		setIsBlurred(false)
	}, []);

	const handleBearishBullishClick = useCallback(() => {
		vibrate([50, 20, 50]);
	}, [vibrate]);

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

				{showButtons && (
					<div className={styles.buttonContainer}>
						<button
							className={styles.actionButton}
							onClick={handleBearishBullishClick}
						>
							<div>Bearish</div>
							<Image src={ChartArrow} alt="Bearish" className="transform rotate-[180deg] scale-x-[-1]"/>
						</button>
						<button
							className={styles.actionButton}
							onClick={handleBearishBullishClick}
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
