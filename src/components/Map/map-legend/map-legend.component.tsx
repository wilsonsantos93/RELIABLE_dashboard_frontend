import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSelectedWeatherField, selectWeatherFields } from "../../../store/settings/settings.selector";
/* import { WeatherFieldRange } from "../../../store/settings/settings.types"; */
import "./map-legend.styles.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setWeatherField } from "../../../store/settings/settings.action";

const MapLegend = () => {
    const selectedWeatherField = useSelector(selectSelectedWeatherField);
    const weatherFields = useSelector(selectWeatherFields);
    const dispatch = useDispatch<any>();
    //const [data, setData] = useState<WeatherFieldRange[] | []>([]);
    const [colors, setColors] = useState<any>();
    const [domain, setDomain] = useState<any>();
    const [tickFormat, setTickFormat] = useState<any>(".0f");
    const [tickValues, setTickValues] = useState<any>();

    useEffect(() => {
        if (!selectedWeatherField) {
            //setData([]);
            return;
        }
        const ranges = selectedWeatherField.ranges.sort((a, b) => b.min - a.min);
        //setData(ranges);

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
            tickFormat = `.${decimalPlaces.length}f`;
        } 
        setTickFormat(tickFormat);

    }, [selectedWeatherField])

    const prev = () => {
        let previousIx: number;
        const ix = weatherFields.findIndex(f => f._id == selectedWeatherField?._id);
        if (ix < 0) return;
        if (ix == 0) previousIx = weatherFields.length-1;
        else previousIx = ix - 1;
        dispatch(setWeatherField(weatherFields[previousIx]));
    }

    const next = () => {
        let nextIx: number;
        const ix = weatherFields.findIndex(f => f._id == selectedWeatherField?._id);
        if (ix < 0) return;
        if (ix == weatherFields.length-1) nextIx = 0;
        else nextIx = ix + 1;
        dispatch(setWeatherField(weatherFields[nextIx]));
    }

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

            {/* <div className="leaflet-control" id="mapLegendArrows">   
                <Button title="Informação anterior" variant="light" onClick={() => prev() } size="sm"><FontAwesomeIcon icon={faArrowLeft} /></Button>
                <Button title="Informação seguinte" variant="light" onClick={() => next() } size="sm"><FontAwesomeIcon icon={faArrowRight} /></Button>
            </div> */}
            

            <div className="leaflet-control" style={{display:"block", background: "#333333b3"}}>
                <Button style={{ margin: "5px", fontSize: "0.575rem"}} title="Informação anterior" variant="light" onClick={() => prev() } size="sm"><FontAwesomeIcon icon={faArrowLeft} /></Button>
                <Button style={{ float: "right", margin: "5px", fontSize: "0.575rem"}} title="Informação seguinte" variant="light" onClick={() => next() } size="sm"><FontAwesomeIcon icon={faArrowRight} /></Button>
                { selectedWeatherField && colors && domain ? 
                    <color-legend
                        class="styled"
                        width="170"
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
            
        </div>

    )
}

export default MapLegend;