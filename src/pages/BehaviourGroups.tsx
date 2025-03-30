
import React, { useState } from "react";
import BehaviourControls from "@/components/behaviour-groups/BehaviourControls";
import BehaviourGroupsChart from "@/components/behaviour-groups/BehaviourGroupsChart";
import BehaviourGroupsDistribution from "@/components/behaviour-groups/BehaviourGroupsDistribution";
import BehaviourGroupsDescription from "@/components/behaviour-groups/BehaviourGroupsDescription";
import { useCountriesWithBehaviourData } from "@/hooks/useBehaviourGroups";

const BehaviourGroups = () => {
  const { data: countries = [] } = useCountriesWithBehaviourData();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [viewType, setViewType] = useState<"comparison" | "trend">("comparison");

  // Set default country when data is loaded
  React.useEffect(() => {
    if (countries.length > 0 && !selectedCountry) {
      setSelectedCountry(countries[0]);
    }
  }, [countries, selectedCountry]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#34502b]">Sustainability Behaviour Groups</h1>
        
        <BehaviourControls
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          viewType={viewType}
          setViewType={setViewType}
        />
        
        <BehaviourGroupsChart
          selectedCountry={selectedCountry}
          viewType={viewType}
        />
        
        {selectedCountry && viewType === "trend" && (
          <BehaviourGroupsDistribution
            selectedCountry={selectedCountry}
          />
        )}
        
        <BehaviourGroupsDescription />
      </div>
    </div>
  );
};

export default BehaviourGroups;
