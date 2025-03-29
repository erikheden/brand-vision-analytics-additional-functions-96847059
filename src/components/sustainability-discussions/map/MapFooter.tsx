
import React from "react";

const MapFooter: React.FC = () => {
  return (
    <div className="mt-4 text-sm text-gray-500 italic text-center">
      <p>Note: The map shows country-level data with county details. Hover or click on counties for more information.</p>
      <p>Some counties may use estimated values based on country averages if specific data isn't available.</p>
    </div>
  );
};

export default MapFooter;
