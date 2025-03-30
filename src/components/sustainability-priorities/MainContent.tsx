
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import SingleCountryView from "./SingleCountryView";
import CountryComparisonPanel from "./CountryComparisonPanel";

const MainContent = () => {
  const [activeView, setActiveView] = useState<string>("single");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#34502b] text-center md:text-left">
          Sustainability Priorities
        </h1>

        <Tabs 
          value={activeView} 
          onValueChange={setActiveView}
          className="w-full"
        >
          <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0">
            <TabsTrigger value="single" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              Single Country
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              Country Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-6 pt-4">
            <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
              <p className="text-gray-600">
                Analyze sustainability priorities for a single country. Select different years, age groups, or specific priority areas to see how they compare.
              </p>
            </Card>
            
            <SingleCountryView />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6 pt-4">
            <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
              <p className="text-gray-600">
                Compare sustainability priorities across multiple countries. Select different countries and priority areas to see how they compare.
              </p>
            </Card>
            
            <CountryComparisonPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MainContent;
