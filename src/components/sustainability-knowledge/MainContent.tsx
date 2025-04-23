
import React from "react";
import { Card } from "@/components/ui/card";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import DashboardLayout from "../layout/DashboardLayout";
import { useKnowledgePage } from "./KnowledgePageProvider";
import KnowledgeTabs from "./KnowledgeTabs";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { useSelectionData } from "@/hooks/useSelectionData";
import { useToast } from "@/components/ui/use-toast";

const MainContent = () => {
  const { toast } = useToast();
  const { 
    selectedCountries, 
    handleCountriesChange,
    isLoading,
    error
  } = useKnowledgePage();
  
  const { countries } = useSelectionData("", []);

  // Helper function to adapt the handleCountriesChange to work with CountryButtonSelect
  const handleCountryToggle = (country: string) => {
    // If country is already in the array, remove it, otherwise add it
    const updatedCountries = selectedCountries.includes(country)
      ? selectedCountries.filter(c => c !== country)
      : [...selectedCountries, country];
    
    handleCountriesChange(updatedCountries);
    
    // Show toast when country is selected
    if (!selectedCountries.includes(country)) {
      toast({
        title: `${country} Selected`,
        description: "Data for this country is being loaded",
      });
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <DashboardLayout
      title="Sustainability Knowledge"
      description="Track and compare consumer understanding of sustainability terms across different markets and time periods."
    >
      <div className="grid grid-cols-1 gap-6 w-full">
        <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md w-full">
          <div className="space-y-4 w-full">
            <h2 className="text-lg font-semibold text-[#34502b]">Select Countries</h2>
            <p className="text-gray-600 text-sm">
              Select one or more countries to view and compare sustainability knowledge.
            </p>
            <CountryButtonSelect
              countries={countries || []}
              selectedCountries={selectedCountries}
              onCountryChange={handleCountryToggle}
            />
          </div>
        </Card>

        {selectedCountries.length > 0 && (
          <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl w-full">
            <KnowledgeTabs />
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MainContent;
