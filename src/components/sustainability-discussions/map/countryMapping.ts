
// Country code mapping for Highcharts
export const countryCodeMapping: Record<string, string> = {
  "Se": "se",  // Sweden
  "No": "no",  // Norway
  "Dk": "dk",  // Denmark
  "Fi": "fi",  // Finland
  "Nl": "nl",  // Netherlands
  // Add uppercase variants
  "SE": "se",
  "NO": "no",
  "DK": "dk",
  "FI": "fi",
  "NL": "nl",
};

// County level detail mapping
export const countyDetails: Record<string, any[]> = {
  "se": [
    { name: "Stockholm", value: 0, lat: 59.3293, lon: 18.0686 },
    { name: "Gothenburg", value: 0, lat: 57.7089, lon: 11.9746 },
    { name: "Malmö", value: 0, lat: 55.6050, lon: 13.0038 },
    { name: "Uppsala", value: 0, lat: 59.8586, lon: 17.6389 },
    { name: "Västerås", value: 0, lat: 59.6099, lon: 16.5448 }
  ],
  "no": [
    { name: "Oslo", value: 0, lat: 59.9139, lon: 10.7522 },
    { name: "Bergen", value: 0, lat: 60.3913, lon: 5.3221 },
    { name: "Trondheim", value: 0, lat: 63.4305, lon: 10.3951 },
    { name: "Stavanger", value: 0, lat: 58.9700, lon: 5.7331 },
    { name: "Drammen", value: 0, lat: 59.7440, lon: 10.2045 }
  ],
  "dk": [
    { name: "Copenhagen", value: 0, lat: 55.6761, lon: 12.5683 },
    { name: "Aarhus", value: 0, lat: 56.1629, lon: 10.2039 },
    { name: "Odense", value: 0, lat: 55.4038, lon: 10.4024 },
    { name: "Aalborg", value: 0, lat: 57.0488, lon: 9.9217 },
    { name: "Esbjerg", value: 0, lat: 55.4678, lon: 8.4523 }
  ],
  "fi": [
    { name: "Helsinki", value: 0, lat: 60.1699, lon: 24.9384 },
    { name: "Espoo", value: 0, lat: 60.2055, lon: 24.6559 },
    { name: "Tampere", value: 0, lat: 61.4978, lon: 23.7610 },
    { name: "Vantaa", value: 0, lat: 60.2934, lon: 25.0378 },
    { name: "Oulu", value: 0, lat: 65.0121, lon: 25.4651 }
  ],
  "nl": [
    { name: "Amsterdam", value: 0, lat: 52.3676, lon: 4.9041 },
    { name: "Rotterdam", value: 0, lat: 51.9244, lon: 4.4777 },
    { name: "The Hague", value: 0, lat: 52.0705, lon: 4.3007 },
    { name: "Utrecht", value: 0, lat: 52.0907, lon: 5.1214 },
    { name: "Eindhoven", value: 0, lat: 51.4416, lon: 5.4697 }
  ]
};
