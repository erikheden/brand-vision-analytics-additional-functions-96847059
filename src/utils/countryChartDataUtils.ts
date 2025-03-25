
import { BrandData } from "@/types/brand";

/**
 * Get color for a specific brand based on its index or name
 */
export const getBrandColor = (brand: string): string => {
  const colorPalette = [
    '#b7c895', '#dadada', '#f0d2b0', '#bce2f3', '#7c9457',
    '#dd8c57', '#6ec0dc', '#1d1d1b', '#34502b', '#09657b'
  ];
  
  // Special case for Market Average
  if (brand === 'Market Average') {
    return '#34502b';
  }
  
  // Hash the brand name to get a consistent color
  let hash = 0;
  for (let i = 0; i < brand.length; i++) {
    hash = ((hash << 5) - hash) + brand.charCodeAt(i);
    hash |= 0;
  }
  
  // Use the absolute value of the hash to get a positive index
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};

/**
 * Standardize a score based on the mean and standard deviation
 */
export const standardizeScore = (
  score: number,
  mean: number,
  stdDev: number
): number => {
  if (stdDev === 0) return 0;
  return (score - mean) / stdDev;
};
