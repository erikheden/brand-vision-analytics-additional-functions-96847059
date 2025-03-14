
import React from 'react';

interface TooltipPointData {
  series: {
    name: string;
    color: string;
  };
  y: number | null;
}

interface ChartTooltipProps {
  standardized: boolean;
}

// Custom tooltip component for Recharts
const ChartTooltip: React.FC<any> = (props) => {
  const { active, payload, label, standardized } = props;
  
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  
  // Sort points for consistent display
  const sortedPoints = [...payload].sort((a, b) => 
    ((b.value ?? 0) - (a.value ?? 0))
  );
  
  return (
    <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
      <p className="font-medium text-sm mb-2">{label}</p>
      <div className="space-y-1.5">
        {sortedPoints.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }} 
            />
            <span className="text-xs text-gray-700">{entry.name}:</span>
            <span className="text-xs font-medium">
              {standardized 
                ? `${entry.value?.toFixed(2)}σ` 
                : entry.value?.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const createTooltipFormatter = (fontFamily: string, standardized: boolean = false) => {
  return function(this: any) {
    if (!this.points) return '';
    
    const sortedPoints = [...this.points].sort((a, b) => 
      ((b.y ?? 0) - (a.y ?? 0)) as number
    );

    const pointsHtml = sortedPoints.map(point => {
      const color = point.series.color;
      const value = standardized ? 
        `${point.y?.toFixed(2)} SD` : 
        point.y?.toFixed(2);
      
      return `
        <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
          <div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%;"></div>
          <span style="color: #ffffff;">${point.series.name}:</span>
          <span style="font-weight: bold; color: #ffffff;">${value}</span>
        </div>
      `;
    }).join('');

    return `
      <div style="font-family: '${fontFamily}'; padding: 8px; background: rgba(52, 80, 43, 0.95); border-radius: 4px;">
        <div style="font-weight: bold; margin-bottom: 8px; color: #ffffff;">${this.x}</div>
        ${pointsHtml}
      </div>
    `;
  };
};

export default ChartTooltip;
