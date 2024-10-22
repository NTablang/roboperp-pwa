import React from 'react'
import { TimeRange } from './page'

function TimeRangeSelector({
  selectedTimeRange,
  onTimeRangeChange,
}: {
  selectedTimeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
}) {
  return (
    <div className='mt-4 space-x-2'>
      {(['1H', '1D', '1W', '∞'] as TimeRange[]).map((range) => (
        <button
          key={range}
          onClick={() => onTimeRangeChange(range)}
          className={`oapcity-60 hover:opacity-100 cursor-pointer font-bold transition-all px-2 text-xs py-1 rounded ${
            selectedTimeRange === range
              ? 'bg-[#F8A700] text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  )
}

export default TimeRangeSelector
