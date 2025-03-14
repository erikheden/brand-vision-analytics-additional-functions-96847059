
// Color palette for country lines in charts - matching the single country view
export const COUNTRY_COLORS = [
  "#34502b", "#09657b", "#dd8c57", "#6ec0dc", "#7c9457", 
  "#b7c895", "#dadada", "#f0d2b0", "#bce2f3", "#1d1d1b"
];

// Brand-specific colors to ensure consistency
export const BRAND_COLORS: Record<string, string> = {
  "H&M": "#34502b",
  "Zalando": "#09657b",
  "Zara": "#dd8c57",
  "IKEA": "#6ec0dc",
  "Adidas": "#7c9457",
  "Nike": "#b7c895",
  "Lego": "#dadada",
  "Oatly": "#f0d2b0",
  "Tesla": "#bce2f3",
  "Volvo": "#1d1d1b",
  "BMW": "#34502b",
  "Apple": "#09657b",
  "Mercedes": "#dd8c57",
  "Samsung": "#6ec0dc",
  "Coca-Cola": "#7c9457",
  "Pepsi": "#b7c895",
  "McDonald's": "#dadada",
  "Toyota": "#f0d2b0",
  "Audi": "#bce2f3",
  "Lidl": "#1d1d1b"
};

// Index-based color assignment for brands not in the predefined map
export const getColorByIndex = (index: number): string => {
  return COUNTRY_COLORS[index % COUNTRY_COLORS.length];
};

// Default brand color for those not in the map
export const DEFAULT_BRAND_COLOR = "#34502b";

// Get color for a specific brand
export const getBrandColor = (brand: string): string => {
  // Try to get color from the predefined map first
  if (BRAND_COLORS[brand]) {
    return BRAND_COLORS[brand];
  }
  
  // If the brand name is case-insensitive match, use that color
  const lowerBrand = brand.toLowerCase();
  const brandKey = Object.keys(BRAND_COLORS).find(
    key => key.toLowerCase() === lowerBrand
  );
  
  if (brandKey) {
    return BRAND_COLORS[brandKey];
  }
  
  // Calculate a consistent hash for the brand name to always get the same color
  let hash = 0;
  for (let i = 0; i < brand.length; i++) {
    hash = (hash << 5) - hash + brand.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Use absolute value of hash to get a positive index
  const colorIndex = Math.abs(hash) % COUNTRY_COLORS.length;
  return COUNTRY_COLORS[colorIndex];
};
