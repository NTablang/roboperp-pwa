import React from 'react'

function DataVerifiabilityInfo() {
  return (
    <div className='mt-6 bg-[#EBEBEB] flex flex-col p-4 gap-2 rounded-md'>
      <div className='text-xs tracking-wide opacity-60'>
        DATA VERIFIABILITY
      </div>
      <div className='text-sm tracking-tight'>
        <span>
          People from all around the world get this data from the web. Through
          zero knowledge cryptography, all aggregated data is verified through
          a <span className='underline'>beacon</span>. Earn a split of this
          market by increasing its data updates.
        </span>
      </div>
    </div>
  )
}

export default DataVerifiabilityInfo
