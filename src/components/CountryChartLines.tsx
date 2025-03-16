
import React from "react";
import { Line } from "recharts";

export interface LineConfig {
  key: string;
  dataKey: string;
  name: string;
  color: string;
  opacity: number;
  strokeDasharray?: string;
}

interface CountryChartLinesProps {
  lines: LineConfig[];
}

const CountryChartLines: React.FC<CountryChartLinesProps> = ({ lines }) => {
  console.log("Rendering CountryChartLines with:", lines);
  
  if (!lines || lines.length === 0) {
    console.log("No lines to render");
    return null;
  }
  
  return (
    <>
      {lines.map(line => {
        console.log(`Rendering line: ${line.dataKey} with color ${line.color} and dash ${line.strokeDasharray || 'solid'}`);
        return (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
            strokeOpacity={line.opacity}
            strokeDasharray={line.strokeDasharray}
            dot={{ r: 4, fill: line.color }}
            activeDot={{ r: 6 }}
            connectNulls={true}
          />
        );
      })}
    </>
  );
};

export default CountryChartLines;
