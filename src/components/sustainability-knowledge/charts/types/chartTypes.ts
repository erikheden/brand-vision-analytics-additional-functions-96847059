
export interface TermData {
  term: string;
  percentage: number;
  year: number;
}

export interface ChartPoint {
  x: number;
  y: number;
  change?: string | null;
}

export interface ChartSeriesData {
  data: ChartPoint[];
  name: string;
  color: string;
  dashStyle?: Highcharts.DashStyleValue;
}
