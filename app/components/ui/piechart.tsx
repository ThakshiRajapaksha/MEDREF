'use client';
import { Pie } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, CardTitle } from './card';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Ensure the chart elements are registered
ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: number[];
  labels: string[];
}

export function PieChart({ data, labels }: PieChartProps) {
  console.log('PieChart received:', { data, labels });

  // Ensure valid data
  if (!data || !labels || data.length === 0 || labels.length === 0) {
    console.warn('No data provided for PieChart');
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Referral Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: ['#0b5345', '#ebf5fb'],
        borderColor: ['#0b5345', '#a3e4d7'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Referral Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '200px', height: '200px' }}>
          <Pie data={chartData} options={chartOptions} />
        </div>
      </CardContent>
    </Card>
  );
}
