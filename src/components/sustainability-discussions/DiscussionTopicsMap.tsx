
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DiscussionTopicData } from "@/hooks/useDiscussionTopicsData";
import HighchartsMapContainer from "./map/HighchartsMapContainer";
import { createMapOptions } from "./map/createMapOptions";
import { useMapData } from "./map/useMapData";
import TopicSelector from "./TopicSelector";
import MapFooter from "./map/MapFooter";
import MapEmptyState from "./map/MapEmptyState";

interface DiscussionTopicsMapProps {
  data: DiscussionTopicData[];
  selectedYear: number;
  selectedTopic?: string;
}

const DiscussionTopicsMap: React.FC<DiscussionTopicsMapProps> = ({
  data,
  selectedYear,
  selectedTopic
}) => {
  const { mapData, hasData } = useMapData(data, selectedYear, selectedTopic);
  
  // Create options for the map
  const mapOptions = createMapOptions(mapData, selectedYear, selectedTopic);
  
  if (!hasData) {
    return <MapEmptyState selectedTopic={selectedTopic} selectedYear={selectedYear} />;
  }
  
  return (
    <div className="flex flex-col space-y-4">
      <Card className="bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <CardContent className="p-4">
          <div className="h-[500px] w-full">
            <HighchartsMapContainer options={mapOptions} mapData={mapData} />
          </div>
        </CardContent>
      </Card>
      
      <MapFooter 
        selectedTopic={selectedTopic} 
        selectedYear={selectedYear} 
        dataPointCount={mapData.length} 
      />
    </div>
  );
};

export default DiscussionTopicsMap;
