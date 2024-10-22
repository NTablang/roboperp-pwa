import { formatDelta, formatNumber } from '@/components/utils/formatters'
import React from 'react'

function PerpHeader({ simplePerpData, delta, marketUpdateData }: any) {
  const getTimeSinceLastUpdate = () => {
    if (!delta || !delta.lastUpdateTime) return ''
    return delta.lastUpdateTime.fromNow()
  }

  return (
    <>
      <div className='mt-8 text-base font-medium tracking-tight text-normal-black'>
        {simplePerpData?.metadata.ticker}
      </div>
      <div>
        <div className='mt-2 text-4xl font-medium tracking-tight text-normal-black'>
          {simplePerpData?.metadata.title}
        </div>
        <div className='text-4xl font-medium tracking-tight text-normal-black'>
          ${formatNumber(simplePerpData?.markPrice, 6)}
        </div>
        {delta && (
          <div className='text-sm font-medium'>
            <span
              className={
                delta.markPrice > 0 ? 'text-green-500' : 'text-red-500'
              }
            >
              {delta.markPrice > 0 ? '▲' : '▼'}
              {formatDelta(Math.abs(delta.markPrice), false, 2, true, false)} (
              {formatDelta(
                delta.markPrice /
                  (parseFloat(marketUpdateData?.[0]?.markPrice || '0') /
                    Math.pow(10, 6)),
                true,
              )}
              )
            </span>
            {' from '}
            {getTimeSinceLastUpdate()}
          </div>
        )}
      </div>

      <div className='mt-2 text-sm text-normal-black'>
        Funding Rate: {formatNumber(simplePerpData?.fundingRate, 18, 4)}%
        {delta && (
          <span
            className={
              delta.fundingRate > 0 ? 'text-green-500' : 'text-red-500'
            }
          >
            {' '}
            ({formatDelta(delta.fundingRate, true, 4)})
          </span>
        )}
      </div>

      <div className='mt-4 text-xs text-gray-500'>
        Contract Address: {simplePerpData?.perpSmartContractAddress}
      </div>
    </>
  )
}

export default PerpHeader
