
import { getFullCountryName } from '@/components/CountrySelect';

/**
 * Creates title and subtitle configuration for the chart
 */
export const createTitleSubtitle = (selectedCountries: string[]) => {
  return {
    title: {
      text: 'Sustainability Discussion Topic Trends'
    },
    subtitle: {
      text: selectedCountries.length === 1 
        ? getFullCountryName(selectedCountries[0]) 
        : `Comparing ${selectedCountries.length} countries`
    }
  };
};
