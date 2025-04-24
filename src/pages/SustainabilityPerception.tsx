
import { useState, useEffect } from "react";
import SelectionPanel from "@/components/sustainability-shared/SelectionPanel";
import ChartSection from "@/components/ChartSection";
import { normalizeCountry } from "@/components/CountrySelect";
import { Card } from "@/components/ui/card";
import BrandSelection from "@/components/BrandSelection";
import { useBrandsQuery } from "@/hooks/queries/useBrandsQuery";
import { useToast } from "@/components/ui/use-toast";

const SustainabilityPerception = () => {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  // Fetch brands for the selected country
  const { 
    data: availableBrands = [], 
    isLoading,
    error
  } = useBrandsQuery(selectedCountry ? selectedCountry : "", []);

  useEffect(() => {
    // Reset brand selection when changing countries
    setSelectedBrands([]);
  }, [selectedCountry]);
  
  useEffect(() => {
    // Show error toast if there's an issue fetching brands
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load brands from database. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  // Update handler for country selection
  const handleCountrySelection = (country: string) => {
    // Normalize country code to ensure consistent format
    const normalizedCountry = normalizeCountry(country);
    setSelectedCountry(normalizedCountry);
  };

  // Extract unique brand names from data
  const uniqueBrandNames = availableBrands
    .filter(item => item.Brand && typeof item.Brand === 'string')
    .map(item => item.Brand as string)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#34502b]">Sustainable Brand Index Dashboard</h1>
          
        <SelectionPanel 
          title="Select Country"
          description="Select a country to view sustainability perception."
          selectedCountry={selectedCountry}
          setSelectedCountry={handleCountrySelection}
        />
          
        {selectedCountry && (
          <>
            <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
              {isLoading ? (
                <div className="text-center py-10">Loading brands...</div>
              ) : uniqueBrandNames.length > 0 ? (
                <BrandSelection 
                  brands={uniqueBrandNames} 
                  selectedBrands={selectedBrands}
                  selectedCountries={[selectedCountry]}
                  onBrandToggle={(brand, checked) => {
                    if (checked) {
                      setSelectedBrands(prev => [...prev, brand]);
                    } else {
                      setSelectedBrands(prev => prev.filter(b => b !== brand));
                    }
                  }}
                  onBatchToggle={(brands, checked) => {
                    if (checked) {
                      setSelectedBrands(prev => [...prev, ...brands.filter(b => !prev.includes(b))]);
                    } else {
                      setSelectedBrands(prev => prev.filter(b => !brands.includes(b)));
                    }
                  }}
                  onClearBrands={() => setSelectedBrands([])}
                />
              ) : (
                <div className="text-center py-10">No brands found for this country. Please select another country.</div>
              )}
            </Card>

            <ChartSection 
              selectedCountry={selectedCountry} 
              selectedBrands={selectedBrands} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SustainabilityPerception;
