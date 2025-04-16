
import React from "react";
import { KnowledgePageProvider } from "./KnowledgePageProvider";
import KnowledgePageLayout from "./KnowledgePageLayout";

const MainContent = () => {
  return (
    <KnowledgePageProvider>
      <KnowledgePageLayout />
    </KnowledgePageProvider>
  );
};

export default MainContent;
