
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
    <div className="space-y-6">
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
