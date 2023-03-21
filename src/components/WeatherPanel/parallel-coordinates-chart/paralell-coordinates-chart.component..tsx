import "./parallel-coordinates-chart.styles.css";
import { useState, useEffect, useRef } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts, { Chart, Series } from 'highcharts';
import HighchartsParallelCoordinates from 'highcharts/modules/parallel-coordinates';
import WeatherPanelStore from "../../../stores/WeatherPanelStore";
import HoveredFeatureStore from "../../../stores/HoveredFeatureStore";
import HC_exporting from 'highcharts/modules/exporting'
HighchartsParallelCoordinates(Highcharts);
HC_exporting(Highcharts);

type CustomSeries = Series & {userOptions: { featureId: string }};

const ParallelCoordinatesChart = (/* { geoJsonLayerRef }: any */) => {
    const chartConfig: any = {
        chart: {
          type: 'spline',
          parallelCoordinates: true,
          parallelAxes: {
              lineWidth: 2
          },
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
                //click: (event: any) => {}
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
    };
    
    const [chartOptions, setChartOptions] = useState<any>(chartConfig);

    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);
    const weatherFields = WeatherPanelStore(state => state.weatherFields);
    const hoveredFeature = HoveredFeatureStore(state => state.featureProperties);
    const geoJsonLayerRef = WeatherPanelStore(state => state.geoJsonLayerRef);
    const isTabOpen = WeatherPanelStore(state => state.isTabOpen);


    const [previousSeries, setPreviousSeries] = useState<CustomSeries | undefined>();

    const chartRef = useRef<any>();

    useEffect(() => {
        onHoveredFeatureChanged();
    }, [hoveredFeature])

    const onHoveredFeatureChanged = () => {
        if (previousSeries) {
            const prevSeries = chartRef?.current?.chart.series.find((s:CustomSeries) => s.userOptions.featureId == previousSeries.userOptions.featureId);
            if (prevSeries) {
                chartRef?.current?.chart.series[prevSeries.index].update({ color: previousSeries.color, lineWidth: 2 });
            }
        }

        if (!hoveredFeature) return;
        updateColor(hoveredFeature._id);
    }

    const updateColor = (featureId: string) => {
        if (!featureId) return;
        const series: any = chartRef?.current?.chart.series.find((s:CustomSeries) => s.userOptions.featureId == featureId);
        if (!series) return;
        setPreviousSeries({ ...series });
        const options = { color: "red", lineWidth: 6 };
        series.update(options);
    }


    useEffect( () => {
        if (!geoJsonLayerRef || !geoJsonLayerRef.current) return;

        setChartOptions((oldChartOptions:any) =>  { 
            return {
                ...oldChartOptions,
                plotOptions: {
                    ...oldChartOptions.plotOptions,
                    series: {
                        ...oldChartOptions.plotOptions.series,
                        events: {
                            ...oldChartOptions.plotOptions.series.events,
                            click: function(event: any) {
                                const featureId = event.point.series.options.featureId;
                                const layer = geoJsonLayerRef.current.getLayer(featureId);
                                layer.fireEvent("click");
                            }
                        }
                    }
                }
            }
        })
    }, [geoJsonLayerRef])

    useEffect(() => {
        onHoveredFeatureChanged();
    }, [chartOptions])


    useEffect(() => {
        const series = comparedFeatures.map((feature:any, i: any) => {
            const data = weatherFields.map(field => feature.weather[field.name]);
            const name = feature.markers?.length ? 
            `${feature.properties.Concelho} (${feature.markers.map((m:any) => m.name).join()})` :
            feature.properties.Concelho;

            return {
                featureId: feature._id,
                name: name,
                data: data,
                shadow: false
            };
        })

        setChartOptions((oldChartOptions: any) => { return { ...oldChartOptions, series }});
    }, [comparedFeatures]);


    useEffect(() => {
        const categories =  weatherFields.map(field => field.displayName);
       
        setChartOptions((oldChartOptions: any) => {
            return { 
                ...oldChartOptions,
                xAxis: {
                    ...oldChartOptions.xAxis,
                    categories: categories
                }
            }
        })
    }, [weatherFields]);

    useEffect(() => {
        const el: any = document.querySelector("#sidebar");
        el?.removeEventListener('transitionend', null);
        el?.addEventListener("transitionend", () => {
            if (isTabOpen) { 
                return 
            }
            else {
                chartRef?.current?.chart.reflow();
            }
        })
        return () => el?.removeEventListener('transitionend', null);
    }, [isTabOpen]);


    return ( 
        comparedFeatures.length ? 
        <HighchartsReact
            ref={chartRef}
            immutable={true}
            highcharts={Highcharts}
            options={chartOptions}
        /> :
        <span>Sem localidades na lista.</span>
    )
}

export default ParallelCoordinatesChart;