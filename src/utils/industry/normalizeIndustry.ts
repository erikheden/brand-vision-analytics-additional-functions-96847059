
// This file is kept for backward compatibility
// It re-exports the functions from the new modular files

import { normalizeIndustryName } from './industryNormalization';
import { normalizeBrandName } from './brandNormalization';
import { getPreferredBrandName } from './brandSelection';

// Re-export for backward compatibility
export {
  normalizeIndustryName,
  normalizeBrandName,
  getPreferredBrandName
};
