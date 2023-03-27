import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSelectedWeatherField } from "../../../store/settings/settings.selector";
/* import WeatherPanelStore from "../../../stores/WeatherPanelStore"; */
import "./map-legend.styles.css";

const MapLegend = () => {
    //const selectedWeatherField = WeatherPanelStore(state => state.selectedInformation);
    const selectedWeatherField = useSelector(selectSelectedWeatherField);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!selectedWeatherField) {
            setData([]);
            return;
        }
        const colours = selectedWeatherField.colours.sort((a:any, b:any) => b.min - a.min);
        setData(colours);
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
                        <div key={d.colour+"_item"} className="legend-list-item">
                            <span className="legend-color" style={{backgroundColor: d.colour}}></span>
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