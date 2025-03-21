
import { FONT_FAMILY } from '@/utils/constants';

/**
 * Creates a standard tooltip container with consistent styling
 */
export const createTooltipContainer = (title: string, content: string, additionalInfo: string = '') => {
  return `
    <div style="font-family: '${FONT_FAMILY}'; padding: 8px; background: #ffffff; border: 1px solid rgba(52, 80, 43, 0.2); border-radius: 4px; min-width: 120px;">
      <div style="font-weight: bold; margin-bottom: 8px; color: #34502b;">${title}</div>
      ${content}
      ${additionalInfo}
    </div>
  `;
};

/**
 * Creates a tooltip point HTML for displaying brand scores
 */
export const createTooltipPoint = (
  name: string, 
  value: string | number, 
  color: string, 
  diffText: string = ''
) => {
  // Format the value if it's a number
  const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
  
  // Add comparison info if provided
  const comparisonHtml = diffText ? 
    `<span style="margin-left: 5px; color: ${diffText.startsWith('+') ? '#34802b' : '#b74134'};">(${diffText})</span>` : 
    '';
  
  return `
    <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
      <div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%;"></div>
      <span style="color: #34502b;">${name}:</span>
      <span style="font-weight: bold; color: #34502b;">${formattedValue}${comparisonHtml}</span>
    </div>
  `;
};

/**
 * Creates HTML for displaying an average score in tooltips
 */
export const createAverageScoreDisplay = (averageScore: number | null) => {
  if (averageScore === null) return '';
  
  return `
    <div style="margin-top: 8px; padding-top: 4px; border-top: 1px dotted #34502b;">
      <span style="color: #34502b; font-style: italic;">Market Average:</span>
      <span style="font-weight: bold; color: #34502b; margin-left: 5px;">${averageScore.toFixed(2)}</span>
    </div>
  `;
};

/**
 * Formats a difference value for display in tooltips
 */
export const formatDifferenceText = (value: number | null, average: number | null): string => {
  if (value === null || average === null) return '';
  
  const diff = value - average;
  return diff >= 0 ? `+${diff.toFixed(2)}` : `${diff.toFixed(2)}`;
};
