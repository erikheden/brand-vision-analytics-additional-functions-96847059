
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CountryButtonSelect from "@/components/CountryButtonSelect";

interface CountryComparisonPanelProps {
  availableCountries: string[];
}

const CountryComparisonPanel: React.FC<CountryComparisonPanelProps> = ({ availableCountries }) => {
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>([]);

  const handleCountryChange = (country: string) => {
    setSelectedCountries(current => 
      current.includes(country) 
        ? current.filter(c => c !== country)
        : [...current, country]
    );
  };

  return (
    <Card className="bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-[#34502b]">Country Comparison</CardTitle>
            <CardDescription>
              Compare sustainability priorities across different countries
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <CountryButtonSelect
          countries={availableCountries}
          selectedCountries={selectedCountries}
          onCountryChange={handleCountryChange}
        />
      </CardContent>
    </Card>
  );
};

export default CountryComparisonPanel;
