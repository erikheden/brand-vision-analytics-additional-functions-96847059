import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: countries = [] } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("NEW SBI Ranking Scores 2011-2024")
        .select('Country')
        .eq('Country', 'Country');
      
      if (error) throw error;
      
      // Get unique countries using Set
      const uniqueCountries = [...new Set(data.map(item => item.Country))].filter(Boolean);
      return uniqueCountries;
    }
  });

  // Fetch brands for selected country
  const { data: brands = [] } = useQuery({
    queryKey: ["brands", selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      const { data, error } = await supabase
        .from("NEW SBI Ranking Scores 2011-2024")
        .select('Brand')
        .eq('Country', selectedCountry);
      
      if (error) throw error;
      
      // Get unique brands using Set
      const uniqueBrands = [...new Set(data.map(item => item.Brand))].filter(Boolean);
      return uniqueBrands;
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

  // Chart configuration
  const chartConfig = {
    ...selectedBrands.reduce((acc, brand) => ({
      ...acc,
      [brand]: {
        label: brand,
        color: brandColors[brand]
      }
    }), {})
  };

  const handleSendMessage = async () => {
    if (!selectedCountry || selectedBrands.length === 0) {
      toast({
        title: "Please select a country and at least one brand",
        variant: "destructive"
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);
    setMessage("");

    try {
      const response = await fetch('/functions/v1/chat-with-rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          country: selectedCountry,
          brands: selectedBrands,
          message,
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Sustainable Brand Index Rankings</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
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
          </div>

          <Card className="p-6">
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-semibold mb-4">Chat with AI about the Rankings</h2>
              
              <ScrollArea className="flex-1 h-[400px] mb-4 pr-4">
                <div className="space-y-4">
                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-8'
                          : 'bg-muted mr-8'
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Ask about the rankings..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isLoading}
                >
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
