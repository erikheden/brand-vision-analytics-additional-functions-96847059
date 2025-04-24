
import { ChartPoint } from '../types/chartTypes';

export const calculateYearsRange = (series: Highcharts.SeriesOptionsType[]): { minYear: number; maxYear: number } => {
  const years = new Set<number>();
  
  series.forEach((s: any) => {
    if (s.data && Array.isArray(s.data)) {
      s.data.forEach((point: ChartPoint | [number, number]) => {
        if (typeof point === 'object' && 'x' in point) {
          years.add(point.x);
        } else if (Array.isArray(point)) {
          years.add(point[0]);
        }
      });
    }
  });
  
  const currentYear = new Date().getFullYear();
  const minYear = years.size > 0 ? Math.min(...Array.from(years)) : currentYear - 5;
  const maxYear = years.size > 0 ? Math.max(...Array.from(years)) : currentYear;
  
  return { minYear, maxYear };
};
