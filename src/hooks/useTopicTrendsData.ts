
import { useMemo } from 'react';
import { DiscussionTopicData } from '@/hooks/useDiscussionTopicsData';

export const useTopicTrendsData = (
  data: DiscussionTopicData[],
  selectedCountries: string[],
  selectedTopics: string[]
) => {
  return useMemo(() => {
    const yearGroups = data.reduce((acc, item) => {
      if (!selectedTopics.includes(item.discussion_topic)) return acc;
      
      const year = item.year;
      if (!acc[year]) {
        acc[year] = {};
      }
      
      const key = `${item.country}-${item.discussion_topic}`;
      acc[year][key] = Math.round(item.percentage * 100);
      
      return acc;
    }, {} as Record<number, Record<string, number>>);

    return Object.entries(yearGroups)
      .map(([year, values]) => ({
        year: parseInt(year),
        ...values
      }))
      .sort((a, b) => a.year - b.year);
  }, [data, selectedTopics]);
};
