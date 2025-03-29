
import Highcharts from "highcharts";
import highchartsWorld from "@highcharts/map-collection/custom/world.geo.json";
import { MapDataItem } from "./mapDataProcessor";

export const createMapOptions = (
  mapData: MapDataItem[],
  selectedYear: number,
  selectedTopic?: string
): Highcharts.Options => {
  return {
    chart: {
      map: highchartsWorld,
      backgroundColor: 'transparent',
    },
    title: {
      text: selectedTopic 
        ? `County-Level Distribution of "${selectedTopic}" Discussions (${selectedYear})`
        : `County-Level Distribution of Sustainability Discussions (${selectedYear})`,
      style: {
        color: '#34502b',
        fontWeight: 'bold',
      }
    },
    subtitle: {
      text: 'Click on counties to view detailed information',
      style: {
        color: '#666',
        fontSize: '0.9em'
      }
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },
    plotOptions: {
      map: {
        states: {
          hover: {
            color: '#34502b'
          }
        }
      },
      mapbubble: {
        minSize: 5,
        maxSize: 30,
        tooltip: {
          pointFormat: '{point.name}: {point.value:.1f}%'
        }
      }
    },
    colorAxis: {
      min: 0,
      max: 100,
      stops: [
        [0, '#D3E4FD'],  // Light blue for low values
        [0.5, '#33C3F0'],  // Mid blue
        [1, '#0FA0CE']   // Dark blue for high values
      ],
      labels: {
        format: '{value}%'
      }
    },
    tooltip: {
      useHTML: true,
      headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
      pointFormat: '<span style="color:{point.color}">\u25CF</span> {point.name}: <b>{point.value:.1f}%</b><br/>' +
                  '{#if point.realCountyData}<span class="font-italic">Real county data</span>{/if}'
    },
    legend: {
      title: {
        text: 'Discussion Percentage'
      }
    },
    series: [
      {
        type: 'map',
        name: 'Country Overview',
        nullColor: '#f8f8f8',
        borderColor: '#888',
        states: {
          hover: {
            color: '#34502b'
          }
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          style: {
            textOutline: '1px contrast',
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#333',
            textShadow: '0 0 3px #fff'
          }
        },
        allAreas: false,
        data: mapData.filter(item => !item.countyLevel)
      },
      {
        type: 'mapbubble',
        name: 'County Detail',
        color: '#0FA0CE',
        data: mapData.filter(item => item.countyLevel),
        cursor: 'pointer',
        minSize: 8,
        maxSize: 30,
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          style: {
            textOutline: '1px white',
            fontSize: '11px',
            color: 'black',
            fontWeight: 'normal',
            textShadow: '0 0 2px white'
          },
          crop: false,
          overflow: 'allow'
        },
        zIndex: 100 // Place bubbles on top
      }
    ] as any
  };
};
