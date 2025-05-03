
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useBehaviourGroups, useYearsWithBehaviourData } from "@/hooks/useBehaviourGroups";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { FONT_FAMILY } from "@/utils/constants";

interface BehaviourGroupsDistributionProps {
  selectedCountry: string;
}

// Updated colors based on the provided image
const COLORS = {
  "Ego": "#E8A27C", // Orange
  "Moderate": "#8BA86B", // Green
  "Smart": "#A67A54", // Brown
  "Dedicated": "#78BBC7" // Blue
};

const BehaviourGroupsDistribution = ({ selectedCountry }: BehaviourGroupsDistributionProps) => {
  const { data: behaviourData = [], isLoading } = useBehaviourGroups(selectedCountry);
  const { data: years = [] } = useYearsWithBehaviourData(selectedCountry);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(Math.max(...years));
    }
  }, [years, selectedYear]);

  // Create chart options for Highcharts
  const chartOptions = React.useMemo(() => {
    if (!selectedYear || !behaviourData.length) return {};
    
    const yearData = behaviourData.filter(item => item.year === selectedYear);
    
    if (!yearData.length) return {};
    
    const pieData = yearData.map(item => ({
      name: item.behaviour_group,
      y: item.percentage * 100, // Convert to percentage
      color: COLORS[item.behaviour_group as keyof typeof COLORS]
    }));

    return {
      chart: {
        type: 'pie',
        style: {
          fontFamily: FONT_FAMILY
        }
      },
      title: {
        text: `Behaviour Groups Distribution in ${selectedCountry}`,
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              fontFamily: FONT_FAMILY
            }
          }
        }
      },
      series: [{
        name: 'Percentage',
        colorByPoint: true,
        data: pieData
      }],
      credits: {
        enabled: false
      }
    };
  }, [behaviourData, selectedYear, selectedCountry]);

  if (isLoading) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading data...</p>
        </div>
      </Card>
    );
  }

  if (!behaviourData.length || !selectedYear) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available for the selected parameters.</p>
        </div>
      </Card>
    );
  }

  const yearData = behaviourData.filter(item => item.year === selectedYear);
  
  if (!yearData.length) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available for the selected year.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h3 className="text-lg font-semibold text-[#34502b]">
          Behaviour Groups Distribution in {selectedCountry}
        </h3>
        <div className="mt-2 md:mt-0">
          <Label htmlFor="year" className="mr-2">Year:</Label>
          <Select
            value={selectedYear?.toString() || ""}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger id="year" className="w-32">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="h-80 w-full">
        <HighchartsReact 
          highcharts={Highcharts} 
          options={chartOptions}
        />
      </div>
    </Card>
  );
};

export default BehaviourGroupsDistribution;
