import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Card } from "@/components/ui/card";

interface ChartSectionProps {
  selectedCountry: string;
  selectedBrands: string[];
}

const ChartSection = ({ selectedCountry, selectedBrands }: ChartSectionProps) => {
  const { data: scores = [] } = useQuery({
    queryKey: ["scores", selectedCountry, selectedBrands],
    queryFn: async () => {
      if (!selectedCountry || selectedBrands.length === 0) return [];
      const { data, error } = await supabase
        .from("NEW SBI Ranking Scores 2011-2024")
        .select("*")
        .eq("Country", selectedCountry)
        .in("Brand", selectedBrands);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCountry && selectedBrands.length > 0
  });

  // Find the earliest and latest years with actual data
  const yearRange = scores.reduce((range, score) => {
    return {
      earliest: Math.min(range.earliest, score.Year),
      latest: Math.max(range.latest, score.Year)
    };
  }, { earliest: Infinity, latest: -Infinity });

  // Process data to only include points where we have actual scores
  const chartData = scores.reduce((acc: any[], score) => {
    const year = score.Year;
    const existingYear = acc.find(item => item.year === year);
    
    if (existingYear) {
      existingYear[score.Brand] = score.Score;
    } else {
      const newDataPoint = { year };
      // Only add score for the current brand
      newDataPoint[score.Brand] = score.Score;
      acc.push(newDataPoint);
    }
    return acc;
  }, []).sort((a, b) => a.year - b.year);

  const brandColors = [
    '#b7c895',
    '#dadada',
    '#f0d2b0',
    '#bce2f3',
    '#7c9457',
    '#dd8c57',
    '#6ec0dc',
    '#1d1d1b',
    '#34502b',
    '#09657b'
  ];

  const chartConfig = Object.fromEntries(
    selectedBrands.map((brand, index) => [
      brand,
      {
        label: brand,
        color: brandColors[index % brandColors.length]
      }
    ])
  );

  return (
    <Card className="p-6">
      {chartData.length > 0 ? (
        <ChartContainer config={chartConfig} className="h-[500px] w-full">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              domain={[yearRange.earliest, yearRange.latest]}
              style={{ fontFamily: 'Forma DJR Display' }}
            />
            <YAxis
              style={{ fontFamily: 'Forma DJR Display' }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend 
              wrapperStyle={{ 
                fontFamily: 'Forma DJR Display',
                paddingTop: '20px'
              }}
            />
            {selectedBrands.map((brand, index) => (
              <Line
                key={brand}
                type="monotone"
                dataKey={brand}
                stroke={brandColors[index % brandColors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      ) : (
        <div className="h-[500px] flex items-center justify-center text-muted-foreground" style={{ fontFamily: 'Forma DJR Display' }}>
          {selectedCountry
            ? "Select brands to view their rankings"
            : "Select a country to get started"}
        </div>
      )}
    </Card>
  );
};

export default ChartSection;