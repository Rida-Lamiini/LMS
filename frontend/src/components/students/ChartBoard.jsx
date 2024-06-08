import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';


const ChartBoard = ({ purchaseData }) => {
  // Extract dates and purchase counts from purchaseData
  const dates = purchaseData.map((dataPoint) => dataPoint.date);
  const purchaseCounts = purchaseData.map((dataPoint) => dataPoint.purchaseCount);

  // Define data for the chart
  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Total Purchases',
        data: purchaseCounts,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  // Define options for the chart
  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day', // Change the unit to 'month', 'year', etc. as needed
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className='bg-white p-4 shadow-md rounded-md'>
      <h2 className='text-lg font-semibold mb-4'>Purchase Data Over Time</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default ChartBoard;
