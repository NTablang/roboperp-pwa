import React from 'react'
import { TimeRange } from './page'

function TimeRangeSelector({
  selectedTimeRange,
  onTimeRangeChange,
  availableRanges,
}: {
  selectedTimeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
  availableRanges: TimeRange[]
}) {
  if (availableRanges.length === 0) {
    return null;
  }

  return (
    <div className='mt-4 space-x-2'>
      {availableRanges.map((range) => (
        <button
          key={range}
          onClick={() => onTimeRangeChange(range)}
          className={`opacity-60 hover:opacity-100 cursor-pointer font-bold transition-all px-2 text-xs py-1 rounded ${
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
