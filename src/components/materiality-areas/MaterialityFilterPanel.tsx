
import React from 'react';
import { Card } from '@/components/ui/card';
import CountrySelect from '@/components/CountrySelect';
import CategorySelector from './CategorySelector';
import FactorToggle from './FactorToggle';

interface MaterialityFilterPanelProps {
  countries: string[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedFactors: string[];
  toggleFactor: (factor: string) => void;
  isLoading: boolean;
}

const MaterialityFilterPanel: React.FC<MaterialityFilterPanelProps> = ({
  countries,
  selectedCountry,
  onCountryChange,
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedFactors,
  toggleFactor,
  isLoading
}) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl">
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading categories...</div>
        ) : categories.length > 0 ? (
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        ) : (
          <div className="text-sm text-gray-500">
            No categories available for this country
          </div>
        )}
        
        {selectedCountry && (
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
