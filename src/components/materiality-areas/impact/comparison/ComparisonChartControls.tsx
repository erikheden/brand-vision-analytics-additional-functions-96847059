
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CategorySelector from '../../CategorySelector';

interface ComparisonChartControlsProps {
  viewMode: 'byCategory' | 'byImpactLevel';
  setViewMode: (mode: 'byCategory' | 'byImpactLevel') => void;
  selectedImpactLevel: string;
  setSelectedImpactLevel: (level: string) => void;
  impactLevels: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedCategories: string[];
}

const ComparisonChartControls: React.FC<ComparisonChartControlsProps> = ({
  viewMode,
  setViewMode,
  selectedImpactLevel,
  setSelectedImpactLevel,
  impactLevels,
  selectedCategory,
  setSelectedCategory,
  selectedCategories,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-lg font-medium text-[#34502b]">
          Country Comparison Analysis
        </h2>
        
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'byCategory' | 'byImpactLevel')} className="w-auto">
          <TabsList className="bg-[#34502b]/10">
            <TabsTrigger value="byCategory" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              By Category
            </TabsTrigger>
            <TabsTrigger value="byImpactLevel" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              By Impact Level
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex flex-col md:flex-row items-start gap-6">
        {viewMode === 'byCategory' ? (
          <div className="w-full md:w-1/3">
            <Label>Select Impact Level</Label>
            <Select value={selectedImpactLevel} onValueChange={setSelectedImpactLevel}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Choose an impact level" />
              </SelectTrigger>
              <SelectContent>
                {impactLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="w-full md:w-1/3">
            <CategorySelector 
              categories={selectedCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonChartControls;
