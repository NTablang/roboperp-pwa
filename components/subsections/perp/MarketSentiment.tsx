// @ts-nocheck
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
  ChartData,
  ChartOptions,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function createGradient(ctx: CanvasRenderingContext2D, area: { bottom: number; top: number }, colors: string[], opacity: number) {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  const colorStops = colors.length - 1;
  colors.forEach((color, index) => {
    gradient.addColorStop(index / colorStops, color.replace(')', `, ${opacity})`));
  });
  return gradient;
}

function getMarketSentiment(openInterestChartData: ChartData<"bar"> | null): JSX.Element | null {
  if (!openInterestChartData || !openInterestChartData.datasets || openInterestChartData.datasets.length < 2) {
    return null;
  }

  const longOpenInterest = openInterestChartData.datasets[0].data[openInterestChartData.datasets[0].data.length - 1] as number;
  const shortOpenInterest = openInterestChartData.datasets[1].data[openInterestChartData.datasets[1].data.length - 1] as number;

  if (longOpenInterest >= shortOpenInterest) {
    return (
      <span className='bg-[#FFAB00] bg-opacity-[9%] tracking-tight font-[400] text-[#FFAE07] text-sm'>People are currently leaning more bullish.</span>
    );
  } else {
    return (
      <span
		className='bg-[#FF9364] bg-opacity-[9%] tracking-tight font-[400] text-[#FF9364] text-sm'
	  >People are currently leaning bearish.</span>
    );
  }
}

function MarketSentiment({ openInterestChartData }: { openInterestChartData: ChartData<"bar"> }) {
  if (!openInterestChartData) return null;

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { display: false },
        border: { display: false },
      },
      y: {
        stacked: true,
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
      customGradients: {
        colors: [
          ["#FFAB00", '#FFD572'],
          ['#FF9364', '#F25F33']
        ]
      }
    },
    barPercentage: 1,
    categoryPercentage: 0.8,
    elements: {
      bar: {
        borderWidth: 0,
      }
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
  };

  const modifiedData: ChartData<"bar"> = {
    ...openInterestChartData,
    datasets: openInterestChartData.datasets.map((dataset, index) => ({
      ...dataset,
      borderRadius: 3,
      borderSkipped: false,
    })),
  };

  return (
    <>
      <div className='mt-4 text-2xl font-medium tracking-tight text-normal-black'>
        Market Sentiment
      </div>
      <div className="mt-1 ">
        {getMarketSentiment(openInterestChartData)}
      </div>
      <div className='mt-8 h-[200px] w-full bg-white'>
        <Bar
          options={chartOptions}
          data={modifiedData}
          plugins={[{
            id: 'customGradients',
            beforeDraw: (chart) => {
              const { ctx, chartArea, data } = chart;
              if (!chartArea) return;

              const gradients = (chartOptions.plugins?.customGradients?.colors || []).map(colorSet => ({
                default: createGradient(ctx, chartArea, colorSet, 0.5),
                hover: createGradient(ctx, chartArea, colorSet, 1),
                latest: createGradient(ctx, chartArea, colorSet, 1),
                latestHover: createGradient(ctx, chartArea, colorSet, 0.5)
              }));

              data.datasets.forEach((dataset, datasetIndex) => {
                dataset.backgroundColor = dataset.data.map((_, dataIndex) =>
                  dataIndex === dataset.data.length - 1 ? gradients[datasetIndex].latest : gradients[datasetIndex].default
                );
                dataset.hoverBackgroundColor = dataset.data.map((_, dataIndex) =>
                  dataIndex === dataset.data.length - 1 ? gradients[datasetIndex].latestHover : gradients[datasetIndex].hover
                );
              });
            }
          }]}
        />
      </div>
    </>
  );
}

export default MarketSentiment;
