
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCountriesWithBehaviourData } from "@/hooks/useBehaviourGroups";
import CountryButtonSelect from "@/components/CountryButtonSelect";

interface BehaviourControlsProps {
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  viewType: "comparison" | "trend";
  setViewType: (viewType: "comparison" | "trend") => void;
}

const BehaviourControls = ({
  selectedCountry,
  setSelectedCountry,
  viewType,
  setViewType
}: BehaviourControlsProps) => {
  const { data: countries = [], isLoading: countriesLoading } = useCountriesWithBehaviourData();

  React.useEffect(() => {
    if (countries.length > 0 && !selectedCountry) {
      setSelectedCountry(countries[0]);
    }
  }, [countries, selectedCountry, setSelectedCountry]);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="space-y-4">
          <div>
            <Label>Select Country</Label>
            <CountryButtonSelect
              selectedCountry={selectedCountry}
              countries={countries}
              onCountryChange={setSelectedCountry}
              disabled={countriesLoading}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label htmlFor="view-type">View Type</Label>
            <Select
              value={viewType}
              onValueChange={(value: "comparison" | "trend") => setViewType(value)}
            >
              <SelectTrigger id="view-type" className="w-full mt-2">
                <SelectValue placeholder="Select view type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comparison">Country Comparison</SelectItem>
                <SelectItem value="trend">Time Trend</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BehaviourControls;
