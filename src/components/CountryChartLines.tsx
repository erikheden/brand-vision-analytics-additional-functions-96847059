
import React from "react";
import { Line } from "recharts";

interface LineConfig {
  key: string;
  dataKey: string;
  name: string;
  color: string;
  opacity: number;
  dashArray?: string;
}

interface CountryChartLinesProps {
  lines: LineConfig[];
}

const CountryChartLines: React.FC<CountryChartLinesProps> = ({ lines }) => {
  return (
    <>
      {lines.map(line => (
        <Line
          key={line.key}
          type="monotone"
          dataKey={line.dataKey}
          name={line.name}
          stroke={line.color}
          strokeWidth={2}
          strokeOpacity={line.opacity}
          strokeDasharray={line.dashArray}
          dot={{ r: 4, fill: line.color }}
          activeDot={{ r: 6 }}
          connectNulls={false} // Critical setting: do not connect through null values
        />
      ))}
    </>
  );
};

export default CountryChartLines;
