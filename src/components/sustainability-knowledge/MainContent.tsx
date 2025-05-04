
import React, { useState, useContext } from "react";
import { Card } from "@/components/ui/card";
import { useSelectionData } from "@/hooks/useSelectionData";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import KnowledgeTabs from "./KnowledgeTabs";
import { KnowledgePageContext } from "./KnowledgePageProvider";
import EmptySelection from "./EmptySelection";
import { useToast } from "@/components/ui/use-toast";

const MainContent: React.FC = () => {
  const { selectedCountries, setSelectedCountries } = useContext(KnowledgePageContext);
  const { countries } = useSelectionData("", []);
  const { toast } = useToast();

  const handleCountryChange = (country: string) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    } else {
      toast({
        title: `${country} Selected`,
        description: "Loading sustainability knowledge data for this country",
      });
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-[#34502b] mb-2">Sustainability Knowledge</h1>
          <p className="text-gray-600 max-w-2xl">
            Explore consumer awareness and understanding of sustainability terms across different markets.
            Use these insights to tailor your sustainability messaging to consumer knowledge levels.
          </p>
        </div>

        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#34502b]">Select Countries</h2>
            <CountryButtonSelect
              countries={countries || []}
              selectedCountries={selectedCountries}
              onCountryChange={handleCountryChange}
            />
          </div>
        </Card>
        
        {selectedCountries.length === 0 ? (
          <EmptySelection />
        ) : (
          <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl">
            <KnowledgeTabs />
          </Card>
        )}
      </div>
    </div>
  );
};

export default MainContent;
