import "./parallel-coordinates-chart.styles.css";
import { useState, useEffect, useRef } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import HighchartsParallelCoordinates from 'highcharts/modules/parallel-coordinates';
import WeatherPanelStore from "../../../stores/WeatherPanelStore";
HighchartsParallelCoordinates(Highcharts);


const ParallelCoordinatesChart = () => {
    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);
    const weatherFields = WeatherPanelStore(state => state.weatherFields);

    const [chartOptions, setChartOptions] = useState({
        chart: {
          type: 'spline',
          parallelCoordinates: true,
          parallelAxes: {
              lineWidth: 2
          }
        },
        title: {
          text: 'Comparação'
        },
        xAxis: {
          categories: [] as string[],
          offset: 10
        },
        series: [] as any[],
        tooltip: {
          pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
              '{series.name}: <b>{point.formattedValue}</b><br/>'
        },
        //colors: ['rgba(11, 200, 200, 0.1)'],
        plotOptions: {
          series: {
              accessibility: {
                  enabled: false
              },
              animation: false,
              marker: {
                  enabled: false,
                  states: {
                      hover: {
                          enabled: false
                      }
                  }
              },
              states: {
                  hover: {
                      halo: {
                          size: 0
                      }
                  }
              },
          }
      },
    });

    useEffect( () => {
        //console.log("Data has changed, updating series");
        const series = comparedFeatures.map((set:any, i: any) => {
            const data = weatherFields.map(field => set.weather[field.name])
            return {
                name: set.properties.Concelho,
                data: data,
                shadow: false
            };
        })

        setChartOptions({ 
            ...chartOptions,
            series: series
        })

        //console.log("SET DATA", chartOptions.series)
    }, [comparedFeatures]);


    useEffect( () => {
        //console.log("weather fields has changed, updating series");
        const categories =  weatherFields.map(field => field.displayName);
       
        setChartOptions({ 
          ...chartOptions,
          xAxis: {
            ...chartOptions.xAxis,
            categories: categories
          }
        })

        //console.log("SET CATEGORIES", chartOptions.xAxis.categories)

    }, [weatherFields]);


    return (
        <HighchartsReact
            immutable={true}
            highcharts={Highcharts}
            options={chartOptions}
        />
    )

}

export default ParallelCoordinatesChart;