import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

interface AnalyticsChartProps {
  data: ChartDataPoint[];
  type?: 'line' | 'bar' | 'area';
  dataKeys: Array<{
    key: string;
    label: string;
    color: string;
  }>;
  title: string;
  height?: number;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  data,
  type = 'line',
  dataKeys,
  title,
  height = 300,
}) => {
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const renderDataKeys = () =>
      dataKeys.map((item) => {
        const Component = type === 'line' ? Line : type === 'bar' ? Bar : Area;
        return (
          <Component
            key={item.key}
            type="monotone"
            dataKey={item.key}
            stroke={item.color}
            fill={item.color}
            fillOpacity={type === 'area' ? 0.6 : 1}
            name={item.label}
          />
        );
      });

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(31 41 55)',
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white',
              }}
            />
            <Legend />
            {renderDataKeys()}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(31 41 55)',
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white',
              }}
            />
            <Legend />
            {renderDataKeys()}
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(31 41 55)',
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white',
              }}
            />
            <Legend />
            {renderDataKeys()}
          </AreaChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
