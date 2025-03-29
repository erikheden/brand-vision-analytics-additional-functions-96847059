
import React from 'react';
import { Card } from '@/components/ui/card';
import CountrySelect from '@/components/CountrySelect';
import IndustrySelector from './IndustrySelector';
import CategorySelector from './CategorySelector';
import FactorToggle from './FactorToggle';

interface MaterialityFilterPanelProps {
  countries: string[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  industries: string[];
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  hasDistinctCategories: boolean;
  selectedFactors: string[];
  toggleFactor: (factor: string) => void;
  isLoading: boolean;
}

const MaterialityFilterPanel: React.FC<MaterialityFilterPanelProps> = ({
  countries,
  selectedCountry,
  onCountryChange,
  industries,
  selectedIndustry,
  setSelectedIndustry,
  categories,
  selectedCategory,
  setSelectedCategory,
  hasDistinctCategories,
  selectedFactors,
  toggleFactor,
  isLoading
}) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl">
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading industries...</div>
        ) : industries.length > 0 ? (
          <IndustrySelector
            industries={industries}
            selectedIndustry={selectedIndustry}
            setSelectedIndustry={setSelectedIndustry}
          />
        ) : (
          <div className="text-sm text-gray-500">
            No industries available for this country
          </div>
        )}
        
        {selectedIndustry && hasDistinctCategories && (
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}
        
        {selectedIndustry && (
          <FactorToggle
            selectedFactors={selectedFactors}
            toggleFactor={toggleFactor}
          />
        )}
      </div>
    </Card>
  );
};

export default MaterialityFilterPanel;
