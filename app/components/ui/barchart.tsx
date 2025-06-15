'use client';
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent, CardTitle } from './card';
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

interface BarChartProps {
  data: number[];
  labels: string[];
  title?: string;
}

export function BarChart({ data, labels, title }: BarChartProps) {
  if (data.length === 0 || labels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
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
        label: 'Count',
        data,
        backgroundColor: ['#065F46', '#10B981', '#0F766E', '#6EE7B7'],
        borderColor: ['#064E3B', '#059669', '#0C4A6E', '#34D399'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Hides the legend
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
