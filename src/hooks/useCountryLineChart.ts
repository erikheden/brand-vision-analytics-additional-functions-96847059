
// This is a stub hook that returns mock data to satisfy the imports
// The actual functionality was part of the removed country comparison feature
export const useCountryLineChart = (chartData = [], selectedBrands = [], allCountriesData = {}, standardized = false) => {
  return {
    chartOptions: {},
    isLoading: false,
    countries: [],
    yAxisDomain: [0, 100],
    lines: [],
    minYear: 2020,
    maxYear: 2025
  };
};
