
import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { MapDataItem } from "./mapDataProcessor";

// Import and initialize the map module
import "highcharts/modules/map";

// Ensure Highcharts is properly loaded with the map module
if (typeof Highcharts === 'object') {
  // The map module adds itself to the Highcharts object when imported
  console.log("Highcharts map module initialized");
}

interface HighchartsMapContainerProps {
  options: Highcharts.Options;
  mapData: MapDataItem[];
}

const HighchartsMapContainer: React.FC<HighchartsMapContainerProps> = ({ 
  options,
  mapData
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  // Update chart when data changes
  useEffect(() => {
    if (chartRef.current && chartRef.current.chart) {
      chartRef.current.chart.update({
        series: [
          {
            data: mapData.filter(item => !item.countyLevel)
          },
          {
            data: mapData.filter(item => item.countyLevel)
          }
        ]
      } as any);
    }
  }, [mapData]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      constructorType={"mapChart"}
      ref={chartRef}
    />
  );
};

export default HighchartsMapContainer;
