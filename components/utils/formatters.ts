export const formatNumber = (
	value: string | undefined,
	decimals: number = 0,
	forceDecimals: number | null = null,
  ) => {
	if (!value) return '0'
	const parsedValue = parseFloat(value) / Math.pow(10, decimals)
	return parsedValue.toLocaleString(undefined, {
	  minimumFractionDigits: forceDecimals !== null ? forceDecimals : 2,
	  maximumFractionDigits: forceDecimals !== null ? forceDecimals : 2,
	})
  }

  export const formatDelta = (
	value: number,
	isPercentage: boolean = false,
	decimals: number = 2,
	includeDollar: boolean = false,
	includeSign: boolean = false,
  ) => {
	const formattedValue = isPercentage
	  ? (value * 100).toFixed(decimals)
	  : value.toFixed(decimals)
	const sign = value > 0 ? '+' : '-'

	return `${includeSign ? sign : ''}${includeDollar ? '$' : ''}${formattedValue}${isPercentage ? '%' : ''}`
  }
