
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell
} from 'recharts';

interface ImpactBarChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title: string;
}

const ImpactBarChart: React.FC<ImpactBarChartProps> = ({ data, title }) => {
  // Color mapping for impact levels
  const getColor = (name: string) => {
    const colorMap: Record<string, string> = {
      'Very high impact': '#34502b',
      'High impact': '#7c9457',
      'Medium impact': '#b7c895',
      'Low impact': '#6ec0dc',
      'Very low impact': '#09657b',
      'No impact': '#d9d9d9',
      'Acting': '#34502b',
      'Aware': '#7c9457',
      'Concerned': '#b7c895',
      'Willing to pay': '#6ec0dc'
    };
    
    return colorMap[name] || '#34502b';
  };
  
  // Sort data for consistent display
  const sortedData = [...data].sort((a, b) => {
    const impactOrder: Record<string, number> = {
      'Very high impact': 1,
      'High impact': 2,
      'Medium impact': 3,
      'Low impact': 4,
      'Very low impact': 5,
      'No impact': 6,
      'Acting': 1,
      'Aware': 2, 
      'Concerned': 3,
      'Willing to pay': 4
    };
    
    return (impactOrder[a.name] || 99) - (impactOrder[b.name] || 99);
  });
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold">{label}</p>
          <p className="text-[#34502b]">
            <span className="font-medium">Percentage: </span>
            {`${payload[0].value.toFixed(1)}%`}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="w-full h-full">
      <h3 className="text-xl font-medium text-center mb-6 text-[#34502b]">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsBarChart
          data={sortedData}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            type="number"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: '#4b5563', fontSize: 12 }}
          />
          <YAxis 
            dataKey="name" 
            type="category"
            width={120}
            tick={{ fill: '#4b5563', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="value" 
            fill="#34502b" 
            name="Impact Level" 
            radius={[0, 4, 4, 0]}
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImpactBarChart;
