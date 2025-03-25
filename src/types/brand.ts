
export interface BrandData {
  Brand: string | null;
  Country: string | null;
  industry: string | null;
  "Row ID": number;
  Score: number | null;
  Year: number | null;
  Projected?: boolean;
  // Cross-country brand comparison fields
  OriginalBrand?: string | null;
  NormalizedBrand?: string;
}
