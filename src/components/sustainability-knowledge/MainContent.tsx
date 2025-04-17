
import React from "react";
import { KnowledgePageProvider } from "./KnowledgePageProvider";
import KnowledgePageLayout from "./KnowledgePageLayout";

const MainContent = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Knowledge</h1>
      <KnowledgePageProvider>
        <KnowledgePageLayout />
      </KnowledgePageProvider>
    </div>
  );
};

export default MainContent;
