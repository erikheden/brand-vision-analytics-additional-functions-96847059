
import React from "react";
import { BarChart, LineChart } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ChartControlsProps {
  chartMode: 'bar' | 'stacked';
  onChartModeChange: (value: string) => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  chartMode,
  onChartModeChange
}) => (
  <ToggleGroup 
    type="single" 
    value={chartMode} 
    onValueChange={onChartModeChange} 
    className="bg-gray-100 rounded-md p-1"
  >
    <ToggleGroupItem 
      value="bar" 
      className="data-[state=on]:bg-white data-[state=on]:text-[#34502b] data-[state=on]:shadow-sm rounded-sm p-2"
      title="Bar Chart"
    >
      <BarChart className="h-4 w-4" />
    </ToggleGroupItem>
    <ToggleGroupItem 
      value="stacked" 
      className="data-[state=on]:bg-white data-[state=on]:text-[#34502b] data-[state=on]:shadow-sm rounded-sm p-2"
      title="Stacked Bar Chart"
    >
      <LineChart className="h-4 w-4" />
    </ToggleGroupItem>
  </ToggleGroup>
);
