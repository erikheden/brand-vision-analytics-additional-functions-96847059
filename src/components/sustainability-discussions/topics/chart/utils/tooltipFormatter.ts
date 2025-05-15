
import Highcharts from 'highcharts';
import { getFullCountryName } from '@/components/CountrySelect';

/**
 * Creates a tooltip formatter function for the topic trends chart
 */
export const createTopicTooltipFormatter = () => {
  return function(this: any): string {
    const self = this as any; // Type assertion to access points
    
    if (!self.points || self.points.length === 0) return '';
    
    let html = `<b>Year: ${self.x}</b><br/>`;
    
    self.points.forEach((point: any) => {
      const [country, topic] = (point.series.name as string).split(' - ');
      html += `<span style="color: ${point.color}">\u25CF</span> ${getFullCountryName(country)} - ${topic}: <b>${point.y?.toFixed(1)}%</b><br/>`;
    });
    
    return html;
  };
};
