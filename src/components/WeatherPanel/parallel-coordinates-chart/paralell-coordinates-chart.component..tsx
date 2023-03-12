import "./parallel-coordinates-chart.styles.css";
import { useState, useEffect, useRef } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts, { Chart, Series } from 'highcharts';
import HighchartsParallelCoordinates from 'highcharts/modules/parallel-coordinates';
import WeatherPanelStore from "../../../stores/WeatherPanelStore";
import HoveredFeatureStore from "../../../stores/HoveredFeatureStore";
HighchartsParallelCoordinates(Highcharts);

type CustomSeries = Series & {userOptions: { featureId: string }};

const ParallelCoordinatesChart = ({ geoJsonLayerRef }: any) => {
    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);
    const weatherFields = WeatherPanelStore(state => state.weatherFields);
    const hoveredFeature = HoveredFeatureStore(state => state.featureProperties);

    //let previousSeries: any = null;
    const [previousSeries, setPreviousSeries] = useState<CustomSeries | undefined>();

    const chartRef = useRef<any>();


    useEffect(() => {
        if (previousSeries) {
            const prevSeries = chartRef.current.chart.series.find((s:CustomSeries) => s.userOptions.featureId == previousSeries.userOptions.featureId);
            if (prevSeries) {
                chartRef.current.chart.series[prevSeries.index].update({ color: previousSeries.color, lineWidth: 2 });
            }
        }

        if (!hoveredFeature) return;
        updateColor(hoveredFeature._id);
    }, [hoveredFeature])

    const updateColor = (featureId: string) => {
        if (!featureId) return;
        const series: any = chartRef.current.chart.series.find((s:CustomSeries) => s.userOptions.featureId == featureId);
        if (!series) return;
        //previousSeries = { ...series };
        setPreviousSeries({ ...series });
        const options = { color: "red", lineWidth: 6 }
        series.update(options);
    }

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
                            const featureId = event.point.series.options.featureId;
                            const layer = geoJsonLayerRef.current.getLayer(featureId);
                            layer.fireEvent("click");
                        }
                    }
                }
            }
        })
    }, [geoJsonLayerRef])


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
            shared: false,
            pointFormat: '<span style="color:{point.color}">\u25CF</span>' + '{series.name}: <b>{point.formattedValue}</b><br/>'
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
                    enabled: false,
                    halo: {
                        size: 2
                    }
                },
                select: {
                    lineColor: 'rgba(100,100,200, 0.25)',
                    fillColor: null,
                    lineWidth: 10,
                    radius: 6,
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
            ref={chartRef}
            immutable={true}
            highcharts={Highcharts}
            options={chartOptions}
        />
    )

}

export default ParallelCoordinatesChart;