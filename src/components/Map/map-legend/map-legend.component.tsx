import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSelectedWeatherField } from "../../../store/settings/settings.selector";
import { WeatherFieldRange } from "../../../store/settings/settings.types";
import "./map-legend.styles.css";

const MapLegend = () => {
    const selectedWeatherField = useSelector(selectSelectedWeatherField);
    const [data, setData] = useState<WeatherFieldRange[] | []>([]);
    const [colors, setColors] = useState<any>();
    const [domain, setDomain] = useState<any>();
    const [tickFormat, setTickFormat] = useState<any>(".0f");
    const [tickValues, setTickValues] = useState<any>();

    useEffect(() => {
        if (!selectedWeatherField) {
            setData([]);
            return;
        }
        const ranges = selectedWeatherField.ranges.sort((a, b) => b.min - a.min);
        setData(ranges);

        setColors(`[${ranges.map(r => `"${r.color}"`).reverse()}]`);

        const domain = ranges.map(r => r.min).reverse();
        domain.push(ranges[0].max);
        setDomain(`[${domain}]`);

        setTickValues(`[${ranges.length && ranges.slice(-1)[0].min}, ${ranges.length && ranges[0].max}]`);

        const sumTicks = ranges.reduce((acc, i) => acc+=i.min, 0);
        const sumTicksStr = sumTicks.toString();
        const decimalPlaces = sumTicksStr.split(".")[1];
        
        let tickFormat = ".0f";
        if (decimalPlaces) {
            setTickFormat(`.${decimalPlaces.length}f`);
        }

    }, [selectedWeatherField])

    const POSITION_CLASSES = {
        bottomleft: 'leaflet-bottom leaflet-left',
        bottomright: 'leaflet-bottom leaflet-right',
        topleft: 'leaflet-top leaflet-left',
        topright: 'leaflet-top leaflet-right',
    };

    return (
        <div id="mapLegend" className={`${POSITION_CLASSES["bottomleft"]}`}>
            {/* <div className="leaflet-control leaflet-bar MapFeatureInformation">
                <span>{selectedWeatherField?.displayName}</span>
                {
                    data && data.map((d:any) => 
                        <div key={d.color+"_item"} className="legend-list-item">
                            <span className="legend-color" style={{backgroundColor: d.color}}></span>
                            <span className="legend-text">
                                { d.min == null && `< ${d.max}` }
                                { d.max == null && `> ${d.min}` }
                                { (d.max != null && d.min != null) && `${d.min} - ${d.max}` }
                            </span>
                            
                        </div>
                    )
                }
            </div> */}

            { selectedWeatherField && colors && domain ? 
            
                <color-legend 
                    class="styled"
                    width="210"
                    tickValues={tickValues}
                    domain={domain}
                    range={colors}
                    titleText={`${selectedWeatherField?.displayName} ${selectedWeatherField.unit && `(${selectedWeatherField.unit})`}`}
                    scaletype="threshold"
                    tickFormat={tickFormat}
                >
                </color-legend>
            : null 
            }
        </div>

    )
}

export default MapLegend;