
// Sample data to use when no database data is available
export const sampleInfluencesData: Record<string, any[]> = {
  "SE": [
    { year: 2021, percentage: 0.35, country: "SE", english_label_short: "TV" },
    { year: 2021, percentage: 0.45, country: "SE", english_label_short: "News Media" },
    { year: 2021, percentage: 0.28, country: "SE", english_label_short: "Social Media" },
    { year: 2021, percentage: 0.22, country: "SE", english_label_short: "Friends & Family" },
    { year: 2022, percentage: 0.38, country: "SE", english_label_short: "TV" },
    { year: 2022, percentage: 0.42, country: "SE", english_label_short: "News Media" },
    { year: 2022, percentage: 0.32, country: "SE", english_label_short: "Social Media" },
    { year: 2022, percentage: 0.25, country: "SE", english_label_short: "Friends & Family" },
    { year: 2023, percentage: 0.41, country: "SE", english_label_short: "TV" },
    { year: 2023, percentage: 0.39, country: "SE", english_label_short: "News Media" },
    { year: 2023, percentage: 0.37, country: "SE", english_label_short: "Social Media" },
    { year: 2023, percentage: 0.29, country: "SE", english_label_short: "Friends & Family" },
    { year: 2024, percentage: 0.43, country: "SE", english_label_short: "TV" },
    { year: 2024, percentage: 0.36, country: "SE", english_label_short: "News Media" },
    { year: 2024, percentage: 0.44, country: "SE", english_label_short: "Social Media" },
    { year: 2024, percentage: 0.32, country: "SE", english_label_short: "Friends & Family" }
  ],
  "NO": [
    { year: 2021, percentage: 0.32, country: "NO", english_label_short: "TV" },
    { year: 2021, percentage: 0.41, country: "NO", english_label_short: "News Media" },
    { year: 2021, percentage: 0.26, country: "NO", english_label_short: "Social Media" },
    { year: 2021, percentage: 0.21, country: "NO", english_label_short: "Friends & Family" },
    { year: 2022, percentage: 0.34, country: "NO", english_label_short: "TV" },
    { year: 2022, percentage: 0.38, country: "NO", english_label_short: "News Media" },
    { year: 2022, percentage: 0.29, country: "NO", english_label_short: "Social Media" },
    { year: 2022, percentage: 0.24, country: "NO", english_label_short: "Friends & Family" },
    { year: 2023, percentage: 0.37, country: "NO", english_label_short: "TV" },
    { year: 2023, percentage: 0.36, country: "NO", english_label_short: "News Media" },
    { year: 2023, percentage: 0.33, country: "NO", english_label_short: "Social Media" },
    { year: 2023, percentage: 0.27, country: "NO", english_label_short: "Friends & Family" },
    { year: 2024, percentage: 0.40, country: "NO", english_label_short: "TV" },
    { year: 2024, percentage: 0.33, country: "NO", english_label_short: "News Media" },
    { year: 2024, percentage: 0.38, country: "NO", english_label_short: "Social Media" },
    { year: 2024, percentage: 0.30, country: "NO", english_label_short: "Friends & Family" }
  ]
};

// Generate sample data for other countries
export const generateSampleDataForCountry = (baseCountry: string): any[] => {
  const baseData = sampleInfluencesData[baseCountry] || sampleInfluencesData["SE"];
  return baseData.map(item => ({
    ...item,
    country: baseCountry,
    percentage: item.percentage * (0.8 + Math.random() * 0.4) // Add some variation
  }));
};

// Add sample data for other countries
["DK", "FI", "NL"].forEach(country => {
  sampleInfluencesData[country] = generateSampleDataForCountry(country);
});
