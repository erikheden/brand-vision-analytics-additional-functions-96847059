import React from "react";
import BehaviourControls from "./BehaviourControls";
import SustainabilityLayout from "../sustainability-shared/SustainabilityLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, TrendingUp } from "lucide-react";
import BehaviourGroupsChart from "./BehaviourGroupsChart";
import BehaviourGroupsDistribution from "./BehaviourGroupsDistribution";
const MainContainer = () => {
  const [activeTab, setActiveTab] = React.useState<string>("distribution");
  const [selectedCountry, setSelectedCountry] = React.useState<string>("");
  const [viewType, setViewType] = React.useState<"comparison" | "trend">("comparison");
  const SelectionPanelContent = <BehaviourControls selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} viewType={viewType} setViewType={setViewType} />;
  return <SustainabilityLayout title="Sustainability Behaviour Groups" description="Track and compare consumer behaviour groups across different markets and time periods." selectionPanel={SelectionPanelContent}>
      {selectedCountry && <Card className="p-6 bg-white border-2 border-[#34502b]/20 shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <TabsList className="grid w-full md:w-auto grid-cols-2">
                <TabsTrigger value="distribution" className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span className="hidden md:inline">Distribution</span>
                </TabsTrigger>
                <TabsTrigger value="trend" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden md:inline">Trends</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="distribution" className="w-full">
              <BehaviourGroupsChart selectedCountry={selectedCountry} viewType={viewType} />
            </TabsContent>

            <TabsContent value="trend" className="w-full">
              <BehaviourGroupsDistribution selectedCountry={selectedCountry} />
            </TabsContent>
          </Tabs>
        </Card>}
    </SustainabilityLayout>;
};
export default MainContainer;