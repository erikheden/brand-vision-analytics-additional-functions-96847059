
export interface BrandData {
  Brand: string | null;
  Country: string | null;
  industry: string | null;
  "Row ID": number;
  Score: number | null;
  Year: number | null;
  Projected?: boolean;
  // New fields for cross-country brand comparison
  OriginalBrand?: string | null;
  NormalizedBrand?: string;
}
