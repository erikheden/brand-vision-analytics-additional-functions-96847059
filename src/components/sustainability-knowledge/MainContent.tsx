
import React from "react";
import { KnowledgePageProvider } from "./KnowledgePageProvider";
import KnowledgePageLayout from "./KnowledgePageLayout";
import SustainabilityLayout from "../sustainability-shared/SustainabilityLayout";
import CountryYearSelector from "./CountryYearSelector";

const MainContent = () => {
  return (
    <KnowledgePageProvider>
      <SustainabilityLayout
        title="Sustainability Knowledge"
        description="Track and compare consumer understanding of sustainability terms across different markets and time periods."
        selectionPanel={<CountryYearSelector />}
      >
        <KnowledgePageLayout />
      </SustainabilityLayout>
    </KnowledgePageProvider>
  );
};

export default MainContent;
