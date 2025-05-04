
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { InfluenceData } from '@/hooks/sustainability-influences';
import { createTrendChartOptions } from './charts/chartOptions/trendChartOptions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface InfluencesTrendChartProps {
  data: Record<string, InfluenceData[]>;
  selectedInfluences: string[];
  countries: string[];
}

const InfluencesTrendChart: React.FC<InfluencesTrendChartProps> = ({
  data,
  selectedInfluences,
  countries
}) => {
  // Create a more descriptive empty state
  if (countries.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select at least one country to display trend data.
        </div>
      </Card>
    );
  }
  
  if (selectedInfluences.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          <p className="mb-3">Please select at least one influence factor to display trend data.</p>
          <Alert className="max-w-md mx-auto bg-blue-50">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Use the sidebar controls to select influence factors.
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    );
  }

  // Check if we have actual data to display
  const hasData = useMemo(() => {
    if (!data || Object.keys(data).length === 0) return false;
    
    // Check if any country has data for any selected influence
    return countries.some(country => {
      const countryData = data[country] || [];
      return countryData.some(item => 
        selectedInfluences.includes(item.english_label_short)
      );
    });
  }, [data, countries, selectedInfluences]);

  if (!hasData) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          No trend data available for the selected countries and influence factors.
        </div>
      </Card>
    );
  }

  // Create chart options using the utility function
  const options = createTrendChartOptions(data, selectedInfluences, countries);

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="h-[500px]">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </Card>
  );
};

export default InfluencesTrendChart;
