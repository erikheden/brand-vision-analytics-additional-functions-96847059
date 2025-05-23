
import Highcharts from 'highcharts';
import { FONT_FAMILY } from '@/utils/constants';

// Use any for now to avoid type errors, then cast appropriately inside
export const createTooltipFormatter = function(this: any): string {
  if (!this.points) return '';
  
  let html = `<div style="font-family:${FONT_FAMILY}"><b>Year: ${this.x}</b><br/>`;
  
  this.points.forEach(point => {
    const [country, term] = (point.series.name as string).split(' - ');
    const pointOptions = point.options as any;
    const change = pointOptions.change;
    
    html += `<span style="color: ${point.color}">\u25CF</span> ${country} - ${term}: <b>${point.y?.toFixed(1)}%</b>`;
    
    if (change) {
      const changeValue = parseFloat(change);
      const changeIcon = changeValue > 0 ? '▲' : '▼';
      const changeColor = changeValue > 0 ? '#34502b' : '#ea4444';
      html += ` <span style="color:${changeColor}">${changeIcon} ${Math.abs(changeValue).toFixed(1)}%</span>`;
    }
    
    html += `<br/>`;
  });
  
  html += '</div>';
  return html;
};
