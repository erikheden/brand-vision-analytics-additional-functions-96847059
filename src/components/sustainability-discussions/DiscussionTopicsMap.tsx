
import React from "react";
import { Card } from "@/components/ui/card";
import { DiscussionTopicData } from "@/hooks/useDiscussionTopicsData";
import { useMapData } from "./map/useMapData";
import { createMapOptions } from "./map/createMapOptions";
import HighchartsMapContainer from "./map/HighchartsMapContainer";
import MapEmptyState from "./map/MapEmptyState";
import MapFooter from "./map/MapFooter";

interface DiscussionTopicsMapProps {
  data: DiscussionTopicData[];
  selectedYear: number;
  selectedTopic?: string;
}

const DiscussionTopicsMap: React.FC<DiscussionTopicsMapProps> = ({
  data,
  selectedYear,
  selectedTopic,
}) => {
  // Debug logs to check data coming in
  React.useEffect(() => {
    console.log("DiscussionTopicsMap received data:", data?.length);
    console.log("DiscussionTopicsMap selected year:", selectedYear);
    console.log("DiscussionTopicsMap selected topic:", selectedTopic);
  }, [data, selectedYear, selectedTopic]);

  // Process the map data
  const { filteredData, mapData, hasData } = useMapData(data, selectedYear, selectedTopic);

  // Configure the chart options
  const options = createMapOptions(mapData, selectedYear, selectedTopic);

  // Display message if no data is available
  if (!hasData) {
    return <MapEmptyState selectedTopic={selectedTopic} selectedYear={selectedYear} />;
  }

  return (
    <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <HighchartsMapContainer options={options} mapData={mapData} />
      <MapFooter />
    </Card>
  );
};

export default DiscussionTopicsMap;
