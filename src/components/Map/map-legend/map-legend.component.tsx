import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSelectedWeatherField, selectWeatherFields } from "../../../store/settings/settings.selector";
import "./map-legend.styles.css";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faInfo } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setWeatherField } from "../../../store/settings/settings.action";
/* import Legend from "./legend";
import * as d3 from "d3"; */
import LegendComponent from "./legend.component";

const MapLegend = () => {
    const selectedWeatherField = useSelector(selectSelectedWeatherField);
    const weatherFields = useSelector(selectWeatherFields);
    const dispatch = useDispatch<any>();
    /* const [colors, setColors] = useState<any>();
    const [domain, setDomain] = useState<any>();
    const [tickFormat, setTickFormat] = useState<any>(".0f");
    const [tickValues, setTickValues] = useState<any>();
    const [scaleType, setScaleType] = useState<string>("threshold");*/
    const [showDescriptionModal, setShowDescriptionModal] = useState(false); 

    /* useEffect(() => {
        if (!selectedWeatherField) {
            return;
        }
        // descending order
        const ranges = [...selectedWeatherField.ranges].sort((a, b) => b.min - a.min);

        setColors(`[${ranges.map(r => `"${r.color}"`).reverse()}]`);

        const domain = ranges.map(r => r.min).reverse();
        domain.push(ranges[0].max || Infinity);
        setDomain(`[${domain}]`);

        setTickValues(`[${ranges.length && ranges.slice(-1)[0].min}, ${ranges.length && (ranges[0].max || '')}]`);

        const sumTicks = ranges.reduce((acc, i) => acc+=i.min, 0);
        const sumTicksStr = sumTicks.toString();
        const decimalPlaces = sumTicksStr.split(".")[1];
        
        let tickFormat = ".0f";
        if (decimalPlaces) {
            tickFormat = `.${decimalPlaces.length}f`;
        } 
        setTickFormat(tickFormat);

    }, [selectedWeatherField]) */

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

    const handleClose = () => {
        setShowDescriptionModal(false);
    }

    const POSITION_CLASSES = {
        bottomleft: 'leaflet-bottom leaflet-left',
        bottomright: 'leaflet-bottom leaflet-right',
        topleft: 'leaflet-top leaflet-left',
        topright: 'leaflet-top leaflet-right',
    };

    /* const legend = () => {
        let color;
        let tickSize;
        const d = JSON.parse(domain.replace(/'/g, '"'));
        const c = JSON.parse(colors.replace(/'/g, '"'));
        let t = [0, d.length-1];
        const width = 180;
        let marginLeft;

        if (selectedWeatherField?.scaleType === 'categorical') {
            d.pop();
            t[1] = d.length-1;
            color = d3.scaleOrdinal(d, c);
            tickSize = 0;
            marginLeft = 25;
        } else {
            color = d3.scaleThreshold(d, c);
        }

        const options = {
            tickSize,
            marginLeft,
            width,
            tickValues: t,
            tickFormat
        };

        return Legend(color, options) as any;
    } */

    return (
        <>
        <div id="mapLegend" className={`${POSITION_CLASSES["bottomleft"]}`}>
            <div className="leaflet-control" id="map-legend-panel">
                <Button style={{ margin: "5px", fontSize: "0.575rem"}} title="Informação anterior" variant="light" onClick={() => prev() } size="sm"><FontAwesomeIcon icon={faArrowLeft} /></Button>
                
                { selectedWeatherField /* && colors && domain */ ? 
                    <div id="newLegend">
                        <div>{`${selectedWeatherField?.displayName} ${selectedWeatherField?.unit && `(${selectedWeatherField?.unit})`}`}</div>
                        {/* <svg dangerouslySetInnerHTML={{__html: legend().innerHTML}} /> */}
                        <LegendComponent weatherField={selectedWeatherField}/>
                    </div> : null
                }
                <Button style={{ float: "right", margin: "5px", fontSize: "0.575rem"}} title="Informação seguinte" variant="light" onClick={() => next() } size="sm"><FontAwesomeIcon icon={faArrowRight} /></Button>
               {/*  { selectedWeatherField && colors && domain ? 
                    <color-legend
                        class="styled"
                        width="180"
                        tickValues={tickValues}
                        domain={domain}
                        range={colors}
                        titleText={`${selectedWeatherField?.displayName} ${selectedWeatherField?.unit && `(${selectedWeatherField?.unit})`}`}
                        scaleType={scaleType}
                        tickFormat={tickFormat}
                    >
                    </color-legend>
                    : null
                } */}

                
            </div>

            { weatherFields && weatherFields.length ?
                <div className="leaflet-control" id="info-legend">   
                    <Button title="Descrição" size="sm" onClick={() => setShowDescriptionModal(true)} >
                        <FontAwesomeIcon style={{ fontSize: "11px" }} icon={faInfo} />
                    </Button>
                </div>
                : null
            }
        </div>

        <Modal show={showDescriptionModal} onHide={handleClose} scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Descrição</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ textAlign: "left" }}>
                {
                    weatherFields.map(f => 
                        <p key={f.name}>
                            <strong>{f.displayName}</strong>: <span>{f.description}</span>
                        </p>
                    )
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Fechar</Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default MapLegend;