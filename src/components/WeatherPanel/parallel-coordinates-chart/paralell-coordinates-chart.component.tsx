import "./parallel-coordinates-chart.styles.css";
import { useState, useEffect, useRef } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts, { Series } from 'highcharts';
import HighchartsParallelCoordinates from 'highcharts/modules/parallel-coordinates';
import HC_exporting from 'highcharts/modules/exporting'
import { useSelector } from "react-redux";
import { selectIsSidebarOpen, selectRegionNamePath, selectWeatherFields } from "../../../store/settings/settings.selector";
import { selectComparedFeatures, selectSelectedFeature } from "../../../store/map/map.selector";
import { selectGeoJsonLayerRef } from "../../../store/refs/refs.selector";
import { getObjectValue } from "../../../utils/reducer/getObjectValue.utils";
HighchartsParallelCoordinates(Highcharts);
HC_exporting(Highcharts);

type CustomSeries = Series & {userOptions: { featureId: string }};

const ParallelCoordinatesChart = () => {
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
            enabled: true,
            maxHeight: 100
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

    const chartRef = useRef<any>();
    const [chartOptions, setChartOptions] = useState<any>(chartConfig);
    const [previousSeries, setPreviousSeries] = useState<CustomSeries | undefined>();

    const weatherFields = useSelector(selectWeatherFields);
    const comparedFeatures = useSelector(selectComparedFeatures);
    const geoJsonLayerRef = useSelector(selectGeoJsonLayerRef);
    const selectedFeature = useSelector(selectSelectedFeature);
    const isSidebarOpen = useSelector(selectIsSidebarOpen);
    const regionNamePath = useSelector(selectRegionNamePath);


    useEffect(() => {
        onHoveredFeatureChanged();
    }, [selectedFeature, chartOptions])

    const onHoveredFeatureChanged = () => {
        if (previousSeries) {
            const prevSeries = chartRef?.current?.chart.series.find((s:CustomSeries) => s.userOptions.featureId == previousSeries.userOptions.featureId);
            if (prevSeries) {
                chartRef?.current?.chart.series[prevSeries.index].update({ color: previousSeries.color, lineWidth: 2, zIndex: 0 });
            }
        }

        if (!selectedFeature) return;
        updateColor(selectedFeature._id);
    }

    const updateColor = (featureId: string) => {
        if (!featureId) return;
        const series: any = chartRef?.current?.chart?.series?.find((s:CustomSeries) => s.userOptions.featureId == featureId);
        if (!series) return;
        setPreviousSeries({ ...series });
        const options = { color: "red", lineWidth: 6, zIndex: 10 };
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
                                if (layer) layer.fireEvent("click");
                            }
                        }
                    }
                }
            }
        })
    }, [geoJsonLayerRef])

    useEffect(() => {
        const series = comparedFeatures.map((feature:any, i: any) => {
            const data = weatherFields.map(field => feature.weather ? feature.weather[field.name] : null);
            const name =/*  feature.markers?.length ? 
            `${feature.properties.Concelho} (${feature.markers.map((m:any) => m.name).join()})` : */
            getObjectValue(regionNamePath, feature);

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
            if (!isSidebarOpen) { 
                chartRef?.current?.chart.reflow(); 
            }
        })
        return () => el?.removeEventListener('transitionend', null);
    }, [isSidebarOpen]);


    return ( 
        comparedFeatures.length ? 
        <HighchartsReact
            ref={chartRef}
            immutable={true}
            highcharts={Highcharts}
            options={chartOptions}
        /> :
        <div className="text-center"><span>Sem localidades na lista.</span></div>
    )
}

export default ParallelCoordinatesChart;