import "./parallel-coordinates-chart.styles.css";
import { useState, useEffect, useRef } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import HighchartsParallelCoordinates from 'highcharts/modules/parallel-coordinates';
import WeatherPanelStore from "../../../stores/WeatherPanelStore";
HighchartsParallelCoordinates(Highcharts);


const ParallelCoordinatesChart = ({ onClickSeries, geoJsonLayerRef }: any) => {
    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);
    const weatherFields = WeatherPanelStore(state => state.weatherFields);

    //const geoJsonLayerRef = WeatherPanelStore(state => state.geoJsonLayerRef);

    useEffect( () => {
        setChartOptions({
            ...chartOptions,
            plotOptions: {
                ...chartOptions.plotOptions,
                series: {
                    ...chartOptions.plotOptions.series,
                    events: {
                        ...chartOptions.plotOptions.series.events,
                        click:  function(event) {
                            /* const featureId = event.target.options.featureId;
                            const layer = geoJsonLayerRef.current.getLayer(featureId);
                            layer.fireEvent("click"); */
                            const featureId = event.point.series.options.featureId;
                            const layer = geoJsonLayerRef.current.getLayer(featureId);
                            layer.fireEvent("click");
                        }
                    }
                }
            }
        })
    }, [geoJsonLayerRef])

    /* const clickSeries = (event: any) => {
        const featureId = event.point.series.options.featureId;
        onClickSeries(featureId);
    } */


    const [chartOptions, setChartOptions] = useState({
        chart: {
          type: 'spline',
          parallelCoordinates: true,
          parallelAxes: {
              lineWidth: 2
          }
        },
        title: {
          text: undefined
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: true
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
            lineWidth: 2,
            cursor: 'pointer',
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
            events: {
                click: (event: any) => {}
            },
            states: {
                hover: {
                    halo: {
                        size: 2
                    }
                }
            },
          }
      },
    });

    useEffect( () => {
        const series = comparedFeatures.map((feature:any, i: any) => {
            const data = weatherFields.map(field => feature.weather[field.name])
            return {
                featureId: feature._id,
                name: feature.properties.Concelho,
                data: data,
                shadow: false
            };
        })

        setChartOptions({ 
            ...chartOptions,
            series: series
        })
    }, [comparedFeatures]);


    useEffect( () => {
        const categories =  weatherFields.map(field => field.displayName);
       
        setChartOptions({ 
          ...chartOptions,
          xAxis: {
            ...chartOptions.xAxis,
            categories: categories
          }
        })
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