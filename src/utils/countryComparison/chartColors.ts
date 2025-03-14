
// Color palette for country lines in charts - matching the single country view
export const COUNTRY_COLORS = [
  "#34502b", "#09657b", "#dd8c57", "#6ec0dc", "#7c9457", 
  "#b7c895", "#dadada", "#f0d2b0", "#bce2f3", "#1d1d1b"
];

// Brand-specific colors to ensure consistency
export const BRAND_COLORS = {
  "H&M": "#34502b",
  "Zalando": "#09657b",
  "Zara": "#dd8c57",
  "IKEA": "#6ec0dc",
  "Adidas": "#7c9457",
  "Nike": "#b7c895",
  "Lego": "#dadada",
  "Oatly": "#f0d2b0",
  "Tesla": "#bce2f3",
  "Volvo": "#1d1d1b"
};

// Default brand color for those not in the map
export const DEFAULT_BRAND_COLOR = "#34502b";

// Get color for a specific brand
export const getBrandColor = (brand: string): string => {
  return BRAND_COLORS[brand as keyof typeof BRAND_COLORS] || DEFAULT_BRAND_COLOR;
};
