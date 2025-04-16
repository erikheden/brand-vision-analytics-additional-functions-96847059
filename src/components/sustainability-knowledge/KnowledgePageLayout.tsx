
import React from "react";
import { useKnowledgePage } from "./KnowledgePageProvider";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import CountryYearSelector from "./CountryYearSelector";
import EmptySelection from "./EmptySelection";
import KnowledgeTabs from "./KnowledgeTabs";

const KnowledgePageLayout: React.FC = () => {
  const { isLoading, error, selectedCountries } = useKnowledgePage();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Knowledge</h1>
      
      <CountryYearSelector />
      
      {selectedCountries.length === 0 ? (
        <EmptySelection />
      ) : (
        <KnowledgeTabs />
      )}
    </div>
  );
};

export default KnowledgePageLayout;
