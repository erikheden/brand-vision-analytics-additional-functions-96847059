
import React from "react";
import { DiscussionTopicData } from "@/hooks/useDiscussionTopicsData";
import { processMapData, MapDataItem } from "./mapDataProcessor";

export const useMapData = (
  data: DiscussionTopicData[],
  selectedYear: number,
  selectedTopic?: string
) => {
  // Filter data by selected year and topic
  const filteredData = React.useMemo(() => {
    let filtered = data.filter(item => item.year === selectedYear);
    
    if (selectedTopic) {
      filtered = filtered.filter(item => item.discussion_topic === selectedTopic);
    }
    
    console.log("Filtered data for map:", filtered);
    return filtered;
  }, [data, selectedYear, selectedTopic]);

  // Prepare data for the map
  const mapData = React.useMemo(() => {
    return processMapData(filteredData);
  }, [filteredData]);

  return {
    filteredData,
    mapData,
    hasData: filteredData.length > 0
  };
};
