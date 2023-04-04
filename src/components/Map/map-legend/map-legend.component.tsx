import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSelectedWeatherField } from "../../../store/settings/settings.selector";
import { WeatherFieldRange } from "../../../store/settings/settings.types";
import "./map-legend.styles.css";

const MapLegend = () => {
    const selectedWeatherField = useSelector(selectSelectedWeatherField);
    const [data, setData] = useState<WeatherFieldRange[] | []>([]);

    useEffect(() => {
        if (!selectedWeatherField) {
            setData([]);
            return;
        }
        const ranges = selectedWeatherField.ranges.sort((a, b) => b.min - a.min);
        setData(ranges);
    }, [selectedWeatherField])

    const POSITION_CLASSES = {
        bottomleft: 'leaflet-bottom leaflet-left',
        bottomright: 'leaflet-bottom leaflet-right',
        topleft: 'leaflet-top leaflet-left',
        topright: 'leaflet-top leaflet-right',
    };

    return (
        <div className={`${POSITION_CLASSES["bottomleft"]}`}>
            <div className="leaflet-control leaflet-bar MapFeatureInformation">
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
            </div>
        </div>
    )
}

export default MapLegend;