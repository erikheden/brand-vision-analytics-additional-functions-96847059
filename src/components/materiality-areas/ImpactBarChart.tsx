
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
import { roundPercentage } from '@/utils/formatting';

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
  const getColor = (category: string, index: number) => {
    const colors = [
      '#34502b', '#7c9457', '#b7c895', '#6ec0dc', '#09657b', '#d9d9d9',
      '#25636b', '#3d7882', '#578d96', '#72a2aa', '#8db7be', '#a8ccd1'
    ];
    
    // Use consistent colors for specific categories if needed
    const colorMap: Record<string, string> = {
      'Food & Beverage': '#34502b',
      'Fashion & Apparel': '#7c9457',
      'Beauty & Personal Care': '#b7c895',
      'Home & Living': '#6ec0dc',
      'Electronics': '#09657b',
      'Travel & Tourism': '#d9d9d9'
    };
    
    return colorMap[category] || colors[index % colors.length];
  };
  
  // Define the correct sorting order for impact levels
  const impactLevelOrder = ["Aware", "Concerned", "Acting", "Willing to pay"];
  
  // Process data for grouped bar chart
  const processedData = useMemo(() => {
    // Get all unique impact levels present in data
    const impactLevels = [...new Set(data.map(item => item.name))];
    
    // Sort impact levels according to defined order
    const sortedLevels = impactLevels.sort((a, b) => {
      const indexA = impactLevelOrder.indexOf(a);
      const indexB = impactLevelOrder.indexOf(b);
      
      // If both are found in the ordering array, compare indices
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If one is not in the ordering array, prioritize the one that is
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither is in the ordering array, sort alphabetically
      return a.localeCompare(b);
    });
    
    // Create data structure for grouped bar chart
    return sortedLevels.map(level => {
      const result: Record<string, any> = { name: level };
      
      // Add value for each category
      categories.forEach(category => {
        const item = data.find(d => d.name === level && d.category === category);
        result[category] = item ? item.value : 0;
      });
      
      return result;
    });
  }, [data, categories, impactLevelOrder]);
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              <span className="font-medium">{entry.name}: </span>
              {`${roundPercentage(entry.value)}%`}
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
            tickFormatter={(value) => `${roundPercentage(value)}%`}
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
              fill={getColor(category, index)} 
              name={category} 
              radius={[0, 4, 4, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImpactBarChart;
