
import React from "react";
import { KnowledgePageProvider } from "./KnowledgePageProvider";
import KnowledgePageLayout from "./KnowledgePageLayout";
import DashboardLayout from "../layout/DashboardLayout";

const MainContent = () => {
  return (
    <DashboardLayout 
      title="Sustainability Knowledge"
      description="Track and compare consumer understanding of sustainability terms across different markets and time periods."
    >
      <KnowledgePageProvider>
        <KnowledgePageLayout />
      </KnowledgePageProvider>
    </DashboardLayout>
  );
};

export default MainContent;
