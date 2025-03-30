
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCountriesWithBehaviourData } from "@/hooks/useBehaviourGroups";

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

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            value={selectedCountry}
            onValueChange={setSelectedCountry}
            disabled={countriesLoading}
          >
            <SelectTrigger id="country" className="w-full">
              <SelectValue placeholder="Select country" />
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
        
        <div className="space-y-2">
          <Label htmlFor="view-type">View Type</Label>
          <Select
            value={viewType}
            onValueChange={(value: "comparison" | "trend") => setViewType(value)}
          >
            <SelectTrigger id="view-type" className="w-full">
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
  );
};

export default BehaviourControls;
