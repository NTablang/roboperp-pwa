import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const openInterestChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      ticks: {
        callback: function (this: any, val: any, index: number, ticks: any) {
          if (index === 0 || index === ticks.length - 1) {
            return this.getLabelForValue(val)
          }
          return ''
        },
        color: '#9B9B9B',
        font: { size: 10 },
      },
    },
    y: {
      stacked: true,
      display: false,
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    },
  },
}

function MarketSentiment({ openInterestChartData }: { openInterestChartData: any }) {
  if (!openInterestChartData) return null

  return (
    <>
      <div className='mt-4 text-2xl font-medium tracking-tight text-normal-black'>
        Market Sentiment
      </div>
      <div className='mt-8 h-[200px] w-full '>
        <Bar
          options={openInterestChartOptions}
          data={openInterestChartData}
        />
      </div>
    </>
  )
}

export default MarketSentiment
