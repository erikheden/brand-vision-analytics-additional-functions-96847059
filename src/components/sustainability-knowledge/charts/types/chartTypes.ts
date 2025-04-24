
export interface TermData {
  term: string;
  percentage: number;
  year: number;
}

export interface ChartPoint {
  x: number;
  y: number;
  change?: string | null;
  // Add any other properties that might be needed by the tooltip formatter
  options?: any;
}

export interface ChartSeriesData {
  data: ChartPoint[];
  name: string;
  color: string;
  dashStyle?: Highcharts.DashStyleValue;
}
