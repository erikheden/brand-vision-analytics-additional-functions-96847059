import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Fetch unique countries
  const { data: countries = [] } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("NEW SBI Ranking Scores 2011-2024")
        .select("Country")
        .distinct();
      
      if (error) throw error;
      return data.map(item => item.Country).filter(Boolean);
    }
  });

  // Fetch brands for selected country
  const { data: brands = [] } = useQuery({
    queryKey: ["brands", selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      const { data, error } = await supabase
        .from("NEW SBI Ranking Scores 2011-2024")
        .select("Brand")
        .eq("Country", selectedCountry)
        .distinct();
      
      if (error) throw error;
      return data.map(item => item.Brand).filter(Boolean);
    },
    enabled: !!selectedCountry
  });

  // Fetch scores for selected brands
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

  // Process data for the chart
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

  // Generate random colors for brands
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

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Sustainable Brand Index Rankings</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Select Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCountry && (
                <div className="space-y-2">
                  <Label>Select Brands</Label>
                  <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(b => b !== brand));
                            }
                          }}
                        />
                        <Label htmlFor={brand}>{brand}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            {chartData.length > 0 ? (
              <ChartContainer className="h-[400px]">
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
        </div>
      </div>
    </div>
  );
};

export default Index;