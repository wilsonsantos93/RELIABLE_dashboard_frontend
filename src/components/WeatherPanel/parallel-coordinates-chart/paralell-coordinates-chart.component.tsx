import "./parallel-coordinates-chart.styles.css";
import { useState, useEffect, useRef, useMemo } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts, { Series} from 'highcharts';
import HighchartsParallelCoordinates from 'highcharts/modules/parallel-coordinates';
import HC_exporting from 'highcharts/modules/exporting'
import { useSelector } from "react-redux";
import { selectIsSidebarOpen, selectOpenTabId, selectRegionNamePath, selectTableSelectedFeatures, selectToggleDataButtonChecked, selectWeatherFields } from "../../../store/settings/settings.selector";
import { selectComparedFeatures, selectSelectedFeature } from "../../../store/map/map.selector";
import { selectGeoJsonLayerRef } from "../../../store/refs/refs.selector";
import { getObjectValue } from "../../../utils/getObjectValue.utils";
import 'primereact/resources/primereact.min.css';
import ToggleDataButton from "../toggle-data-button/toggle-data-button.component";

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
        responsive: {
            maxHeight: 100
        },
        title: {
          text: undefined
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: true,
            maxHeight: 70
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
            events: {},
            states: {
                hover: {
                    enabled: false,
                    halo: {
                        size: 2,
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
    const toggleDataButtonChecked = useSelector(selectToggleDataButtonChecked);
    const weatherFields = useSelector(selectWeatherFields);
    const comparedFeatures = useSelector(selectComparedFeatures);
    const geoJsonLayerRef = useSelector(selectGeoJsonLayerRef);
    const selectedFeature = useSelector(selectSelectedFeature);
    const isSidebarOpen = useSelector(selectIsSidebarOpen);
    const regionNamePath = useSelector(selectRegionNamePath);
    const tableSelectedFeatures = useSelector(selectTableSelectedFeatures);
    const openTabId = useSelector(selectOpenTabId);

    // Selected feature event
    useEffect(() => {
        onHoveredFeatureChanged();
    }, [selectedFeature, chartOptions])

    const onHoveredFeatureChanged = () => {
        if (previousSeries) {
            const prevSeries = chartRef?.current?.chart?.series.find((s:CustomSeries) => s.userOptions.featureId == previousSeries.userOptions.featureId);
            if (prevSeries) {
                chartRef?.current?.chart?.series[prevSeries.index].update({ color: previousSeries.color, lineWidth: 2, zIndex: 0 });
            }
        }

        if (!selectedFeature) return;
        updateColor(selectedFeature._id);
    }

    // Update series color for selected feature
    const updateColor = (featureId: string) => {
        if (!featureId) return;
        const series: any = chartRef?.current?.chart?.series?.find((s:CustomSeries) => s.userOptions.featureId == featureId);
        if (!series) return;
        setPreviousSeries({ ...series });
        const options = { color: "#6366f1", lineWidth: 7, zIndex: 10 };
        series.update(options, false);
        chartRef?.current?.chart?.redraw(); 
    }

    // Set click event handler
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
                            },
                        }
                    }
                }
            }
        })
    }, [geoJsonLayerRef]);

    const setChartData = () => {
        if (weatherFields && comparedFeatures && chartRef.current) {
            const categories = weatherFields.map(field => field.displayName);
            
            const series = comparedFeatures.map((feature: any) => {
                const data = weatherFields.map(field => feature.weather && feature.weather.hasOwnProperty(field.name) ? feature.weather[field.name] : null);
                const name = getObjectValue(regionNamePath, feature);
    
                let visible = true;
    
                if (toggleDataButtonChecked) {
                    visible = tableSelectedFeatures.find((f: any) => f._id == feature._id) ? true : false;
                }
    
                return {
                    featureId: feature._id,
                    name: name,
                    data: data,
                    shadow: false,
                    showInLegend: visible,
                    visible
                };
            });

            setChartOptions((oldChartOptions: any) => { 
                return { 
                    ...oldChartOptions, 
                    series,
                    xAxis: {
                        ...oldChartOptions.xAxis,
                        categories: categories
                    }
                }
            });
        }
        return;
    }

    const removeChartData = () => {
        setChartOptions((oldChartOptions: any) => { 
            return { 
                ...oldChartOptions, 
                series: [],
                xAxis: {
                    ...oldChartOptions.xAxis,
                    categories: []
                }
            }
        });
    }

    useEffect(() => {
        setChartData();
    }, [weatherFields, comparedFeatures, chartRef]);


    useEffect(() => {
        const el: any = document.querySelector("#sidebar");
        el?.removeEventListener('transitionend', null);
        el?.addEventListener("transitionend", () => {
            if (!isSidebarOpen) { 
                chartRef?.current?.chart?.reflow(); 
            }
        })
        return () => el?.removeEventListener('transitionend', null);
    }, [isSidebarOpen]);


    useEffect(() => {
        if (toggleDataButtonChecked) {
            showSelectedFeatures();
        } else {
            showAllFeatures();
        }
    }, [toggleDataButtonChecked]);

    const showAllFeatures = () => {
        chartRef?.current?.chart?.series.forEach((s: any) => {
            s.setVisible(true, false);
            s.update({ showInLegend: true }, false);
        });
        chartRef?.current?.chart.redraw(); 
    }

    const showSelectedFeatures = () => {
        chartRef?.current?.chart?.series.forEach((s: any) => {
            if (tableSelectedFeatures.find((f: any) => f._id == s.userOptions.featureId)) {
                s.setVisible(true, false);
                s.update({ showInLegend: true }, false);
            }
            else {
                s.setVisible(false, false);
                s.update({ showInLegend: false }, false);
            }
        });
        chartRef?.current?.chart.redraw(); 
    }

    useEffect(() => {
        if (isSidebarOpen && openTabId == 2) {
            setChartData();
        } else {
            if (chartRef?.current?.chart?.series.length) removeChartData();
        }
    }, [isSidebarOpen, openTabId, tableSelectedFeatures])

    return ( 
        (comparedFeatures.length) ? 
        <>
            <div style={{ padding: "0.5rem 0.5rem" }}>
                <ToggleDataButton />
            </div>

            <HighchartsReact
                ref={chartRef}
                immutable={true}
                highcharts={Highcharts}
                options={chartOptions}
            /> 
        </> 
        :
        <div className="text-center"><span>Sem localidades na lista.</span></div>
    )
}

export default ParallelCoordinatesChart;