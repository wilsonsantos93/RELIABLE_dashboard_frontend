import "./parallel-coordinates-chart.styles.css";
import { useState, useEffect, useRef } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts, { Series} from 'highcharts';
import HighchartsParallelCoordinates from 'highcharts/modules/parallel-coordinates';
import HC_exporting from 'highcharts/modules/exporting'
import { useSelector } from "react-redux";
import { selectIsSidebarOpen, selectRegionNamePath, selectTableSelectedFeatures, selectWeatherFields } from "../../../store/settings/settings.selector";
import { selectComparedFeatures, selectSelectedFeature } from "../../../store/map/map.selector";
import { selectGeoJsonLayerRef } from "../../../store/refs/refs.selector";
import { getObjectValue } from "../../../utils/reducer/getObjectValue.utils";
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/primereact.min.css';

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

    const options = [
        { name: 'Tudo', code: 'all' } , 
        { name: 'Seleção do mapa', code: 'selection'},
        /* { name: 'Personalizado', code: 'custom' },  */
    ];

    const chartRef = useRef<any>();
    const [chartOptions, setChartOptions] = useState<any>(chartConfig);
    const [previousSeries, setPreviousSeries] = useState<CustomSeries | undefined>();
    const [selectedOption, setSelectedOption] = useState<any>(options[0]);

    const weatherFields = useSelector(selectWeatherFields);
    const comparedFeatures = useSelector(selectComparedFeatures);
    const geoJsonLayerRef = useSelector(selectGeoJsonLayerRef);
    const selectedFeature = useSelector(selectSelectedFeature);
    const isSidebarOpen = useSelector(selectIsSidebarOpen);
    const regionNamePath = useSelector(selectRegionNamePath);
    const tableSelectedFeatures = useSelector(selectTableSelectedFeatures);

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

    const updateColor = (featureId: string) => {
        if (!featureId) return;
        const series: any = chartRef?.current?.chart?.series?.find((s:CustomSeries) => s.userOptions.featureId == featureId);
        if (!series) return;
        setPreviousSeries({ ...series });
        const options = { color: "#6366f1", lineWidth: 7, zIndex: 10 };
        series.update(options, false);
        chartRef?.current?.chart?.redraw(); 
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
                            },
                        }
                    }
                }
            }
        })
    }, [geoJsonLayerRef])

    useEffect(() => {
        if (weatherFields && comparedFeatures && chartRef.current) {
            const categories = weatherFields.map(field => field.displayName);

            const series = comparedFeatures.map((feature: any) => {
                const data = weatherFields.map(field => feature.weather && feature.weather.hasOwnProperty(field.name) ? feature.weather[field.name] : null);
                const name = getObjectValue(regionNamePath, feature);
    
                return {
                    featureId: feature._id,
                    name: name,
                    data: data,
                    shadow: false,
                    showInLegend: true
                };
            })
    
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


    const onSelectOption = (e: any) => {
        if (e.value.code == 'all') {
            chartRef?.current?.chart?.series.forEach((s: any) => {
                s.setVisible(true, false);
                s.update({ showInLegend: true }, false);
            });
        }

        /* else if (e.value.code == 'custom') {
            chartRef?.current?.chart?.series.forEach((s: any) => {
                s.setVisible(false, false);
                s.update({ showInLegend: true }, false);
            });
        } */

        else {
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
        }
        
        chartRef?.current?.chart.redraw(); 
        setSelectedOption(e.value);
    }

    useEffect(() => {
        if (tableSelectedFeatures.length && selectedOption.code === 'selection') {
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
    }, [tableSelectedFeatures])

    return ( 
        comparedFeatures.length ? 
        <>
            <div style={{ margin: '2px'}}>
                <span>Mostrar: </span>
                <Dropdown value={selectedOption} onChange={(e) => onSelectOption(e)} options={options} optionLabel="name" 
                    placeholder="Selecione uma opção" className="w-full md:w-14rem" />
                { selectedOption.code == 'selection' && <span> Selecione no mapa para visualizar no gráfico</span> }
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