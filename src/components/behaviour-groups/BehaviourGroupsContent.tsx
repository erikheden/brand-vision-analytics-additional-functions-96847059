
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import { useCountriesWithBehaviourData } from "@/hooks/useBehaviourGroups";
import BehaviourGroupsDistribution from "./BehaviourGroupsDistribution";
import BehaviourGroupsChart from "./BehaviourGroupsChart";
import BehaviourGroupsComparison from "./BehaviourGroupsComparison";

const BehaviourGroupsContent = () => {
  const [selectedCountries, setSelectedCountries] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState("distribution");
  const { data: countries = [], isLoading: countriesLoading } = useCountriesWithBehaviourData();

  const handleCountryChange = (country: string) => {
    if (activeTab === "distribution") {
      setSelectedCountries([country]); // Single selection for distribution
    } else {
      // Multiple selection for comparison
      setSelectedCountries(current =>
        current.includes(country)
          ? current.filter(c => c !== country)
          : [...current, country]
      );
    }
  };

  // Reset selection when changing tabs
  React.useEffect(() => {
    if (activeTab === "distribution" && selectedCountries.length > 1) {
      setSelectedCountries([selectedCountries[0]]);
    }
  }, [activeTab, selectedCountries]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-[#34502b]">Sustainability Behaviour Groups</h1>

        <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#34502b]">Select Countries</h2>
            <CountryButtonSelect
              countries={countries}
              selectedCountries={selectedCountries}
              onCountryChange={handleCountryChange}
              disabled={countriesLoading}
            />
          </div>
        </Card>

        {selectedCountries.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0 mb-6">
              <TabsTrigger 
                value="distribution" 
                className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
              >
                Current Distribution
              </TabsTrigger>
              <TabsTrigger 
                value="trends" 
                className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
              >
                Trends
              </TabsTrigger>
              <TabsTrigger 
                value="comparison" 
                className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
              >
                Comparison
              </TabsTrigger>
            </TabsList>

            <TabsContent value="distribution">
              <BehaviourGroupsDistribution selectedCountry={selectedCountries[0]} />
            </TabsContent>

            <TabsContent value="trends">
              <BehaviourGroupsChart 
                selectedCountry={selectedCountries[0]} 
                viewType="trend" 
              />
            </TabsContent>

            <TabsContent value="comparison">
              <BehaviourGroupsComparison selectedCountries={selectedCountries} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default BehaviourGroupsContent;
