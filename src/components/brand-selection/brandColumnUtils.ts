
/**
 * Reorganizes brands into columns for more balanced display
 */
export const reorganizeBrandsIntoColumns = (brands: string[], numColumns: number = 4): string[] => {
  const sortedBrands = [...brands].sort((a, b) => a.localeCompare(b));
  
  const result: string[] = new Array(sortedBrands.length);
  const itemsPerColumn = Math.ceil(sortedBrands.length / numColumns);
  
  for (let i = 0; i < sortedBrands.length; i++) {
    const column = Math.floor(i / itemsPerColumn);
    const row = i % itemsPerColumn;
    const newIndex = row * numColumns + column;
    
    if (newIndex < sortedBrands.length) {
      result[newIndex] = sortedBrands[i];
    }
  }
  
  return result.filter(brand => brand !== undefined);
};
