
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
      'No impact': '#d9d9d9'
    };
    
    return colorMap[name] || '#34502b';
  };
  
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
      <h3 className="text-lg font-medium text-center mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RechartsBarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 70,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={80} 
            tick={{ fill: '#4b5563', fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 100]} 
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: '#4b5563', fontSize: 12 }}
            label={{ 
              value: 'Percentage of Consumers', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#4b5563', fontSize: 12, textAnchor: 'middle' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ bottom: 0 }} />
          <Bar 
            dataKey="value" 
            fill="#34502b" 
            name="Impact Level" 
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImpactBarChart;
