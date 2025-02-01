import React from 'react';

interface TooltipPointData {
  series: {
    name: string;
    color: string;
  };
  y: number | null;
}

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