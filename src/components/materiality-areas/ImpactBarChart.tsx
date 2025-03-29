
import React, { useMemo } from 'react';
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
    category: string;
  }>;
  title: string;
  categories: string[];
}

const ImpactBarChart: React.FC<ImpactBarChartProps> = ({ data, title, categories }) => {
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
  
  // Get category colors for the legend
  const getCategoryColor = (index: number) => {
    const colors = ['#34502b', '#7c9457', '#b7c895', '#6ec0dc', '#09657b', '#d9d9d9'];
    return colors[index % colors.length];
  };
  
  // Order of impact levels for consistent display
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
  
  // Process data for grouped bar chart
  const processedData = useMemo(() => {
    // First, get all unique impact levels across all categories
    const impactLevels = Array.from(new Set(data.map(item => item.name)))
      .sort((a, b) => (impactOrder[a] || 99) - (impactOrder[b] || 99));
    
    // Create data structure for grouped bar chart
    return impactLevels.map(level => {
      const result: Record<string, any> = { name: level };
      
      // Add value for each category
      categories.forEach(category => {
        const item = data.find(d => d.name === level && d.category === category);
        result[category] = item ? item.value : 0;
      });
      
      return result;
    });
  }, [data, categories]);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              <span className="font-medium">{entry.name}: </span>
              {`${entry.value.toFixed(1)}%`}
            </p>
          ))}
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
          data={processedData}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 150,
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
            width={140}
            tick={{ fill: '#4b5563', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {categories.map((category, index) => (
            <Bar 
              key={category}
              dataKey={category} 
              fill={getCategoryColor(index)} 
              name={category} 
              stackId="a"
              radius={[0, 4, 4, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImpactBarChart;
