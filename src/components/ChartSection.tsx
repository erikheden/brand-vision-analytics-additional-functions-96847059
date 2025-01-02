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

  const chartData = scores.reduce((acc: any[], score) => {
    const year = score.Year;
    const existingYear = acc.find(item => item.year === year);
    
    if (existingYear) {
      existingYear[score.Brand] = score.Score;
    } else {
      acc.push({
        year,
        [score.Brand]: score.Score
      });
    }
    return acc;
  }, []).sort((a, b) => a.year - b.year);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const brandColors = Object.fromEntries(
    selectedBrands.map(brand => [brand, getRandomColor()])
  );

  const chartConfig = {
    ...selectedBrands.reduce((acc, brand) => ({
      ...acc,
      [brand]: {
        label: brand,
        color: brandColors[brand]
      }
    }), {})
  };

  return (
    <Card className="p-6">
      {chartData.length > 0 ? (
        <ChartContainer config={chartConfig} className="h-[400px]">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {selectedBrands.map((brand) => (
              <Line
                key={brand}
                type="monotone"
                dataKey={brand}
                stroke={brandColors[brand]}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      ) : (
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          {selectedCountry
            ? "Select brands to view their rankings"
            : "Select a country to get started"}
        </div>
      )}
    </Card>
  );
};

export default ChartSection;