import { Marker, Popup } from "react-leaflet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import UserMarkerStore from "../../../stores/UserMarkerStore";
import "./user-marker.styles.css";
import WeatherPanelStore from "../../../stores/WeatherPanelStore";
import L from "leaflet";
import HoveredFeatureStore from "../../../stores/HoveredFeatureStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { faEdit, faEyeSlash, faTrash, faUpDownLeftRight } from "@fortawesome/free-solid-svg-icons";
import UserStore from "../../../stores/UserStore";
declare function require(name:string):any;
const leafletPip = require('@mapbox/leaflet-pip');

const markerIcon = new Icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41], 
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

const UserMarker = (props: any) => {
    const [draggable, setDraggable] = useState(false);
    const [editable, setEditable] = useState(false);
    const [layer, setLayer] = useState<any>(null);
    const markerRef = useRef(null);

    const removeUserMarker = UserStore(state => state.removeUserMarker);
    const updateUserMarker = UserStore(state => state.updateUserMarker);
    const geoJsonLayerRef = WeatherPanelStore(state => state.geoJsonLayerRef);
    const selectedWeatherField = WeatherPanelStore(state => state.selectedInformation);
    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);
    const setComparedFeatures = WeatherPanelStore(state => state.setComparedFeatures);
    const setFeatureProperties = HoveredFeatureStore(state => state.setFeatureProperties);

    const eventHandlers = useMemo(
        () => ({
            async dragend() {
                const marker: any = markerRef.current;
                if (marker != null) {
                    await updateUserMarker(props.data._id, undefined, marker.getLatLng());
                    toggleDraggable();
                    marker.fire("click");
                }
            },

            click() {
                const latlngPoint = new L.LatLng(props.data.lat, props.data.lng);
                const results = leafletPip.pointInLayer(latlngPoint, geoJsonLayerRef.current, true);
                if (!results || !results.length) return;
                results.forEach(function(layer: any) {
                    setLayer(layer);
                    layer.fire('click', {
                        marker: props.data || { _id: null },
                        markerRef: markerRef.current || null,
                        latlng: { lat: props.data.lat, lng: props.data.lng }
                    });

                    const feature = { 
                        _id: layer.feature._id, 
                        properties: layer.feature.properties, 
                        weather: layer.feature.weather,
                        markers: layer.markers,
                        marker: props.data || { _id: null }, 
                        markerRef: markerRef.current
                    }
                    setFeatureProperties(feature)
                });
            },
        }),
        [geoJsonLayerRef, comparedFeatures],
    );

    /* useEffect(() => {
        if (!geoJsonLayerRef) return;
        const latlngPoint = new L.LatLng(props.data.lat, props.data.lng);
        const results = leafletPip.pointInLayer(latlngPoint, geoJsonLayerRef.current, true);
        results.forEach((layer: any) => {
            setLayer(layer);
            const l = geoJsonLayerRef.current.getLayer(layer.feature._id);
            console.log("Found layer for marker");
            l.markers.push(markerRef.current);
        });
    }, [geoJsonLayerRef]) */
    
    useEffect(() => {
        const marker: any = markerRef.current;
        /* marker.feature = { 
            type: 'Point', 
            properties: { ...props.data }, 
            geometry: undefined 
        }; */
        marker._leaflet_id = props.data._id;
        marker.getPopup().on('remove', function() {
            setEditable(false);
        });
    }, [])

    const updatePopupContent = (layer: any) => {
        if (!selectedWeatherField || !layer) return null;
        return <div>
            <span>{selectedWeatherField?.displayName}: </span>
            <span>{selectedWeatherField && layer.feature.weather ? layer.feature.weather[selectedWeatherField.name] : ''} {selectedWeatherField.unit}</span>
            <br/>
            <div style={{marginTop: "2px", display: "flex", justifyContent: "space-around"}}>
                <Button onClick={toggleEditable} title="Editar nome" variant="outline-primary" size="sm"><FontAwesomeIcon icon={faEdit}/></Button>
                <Button onClick={toggleDraggable} title="Mover" variant="outline-primary" size="sm"><FontAwesomeIcon icon={faUpDownLeftRight}/></Button>
                <Button onClick={() => onRemove()} title="Eliminar" variant="outline-danger" size="sm"><FontAwesomeIcon icon={faTrash}/></Button>
                <Button onClick={() => onRemoveFeature()}  title="Remover da lista" variant="outline-danger" size="sm"><FontAwesomeIcon icon={faEyeSlash}/></Button>
            </div>
        </div>
    }

    const toggleDraggable = useCallback(() => {
        setDraggable((d) => !d)
    }, []);

    const toggleEditable = useCallback(() => {
        setEditable((e) => !e)
    }, []);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const target = e.target as any;
            await updateUserMarker(props.data._id, target.value);
            toggleEditable();
        }
    }

    const onRemove = () => {
        const l = geoJsonLayerRef.current.getLayer(layer.feature._id);
        if (!l) return;
        l.markers = l.markers.filter((m:any) => m._id != props.data._id)
        removeUserMarker(props.data._id);
        //onRemoveFeature();

/*         // update comparedFeatures list
        console.log("UPDATED MARKERS", l.markers);
        const compFeatures = [...comparedFeatures];
        const ix = compFeatures.findIndex((f:any) => f._id == layer.feature._id)
        compFeatures[ix].markers = l.markers;
        console.log(compFeatures[ix]);
        setComparedFeatures(compFeatures); */
    }

    const onRemoveFeature = () => {
        if (!layer) return;
        const filteredFeatures = comparedFeatures.filter((f:any) => f._id != layer.feature._id);
        setComparedFeatures(filteredFeatures);
        const l = geoJsonLayerRef.current.getLayer(layer.feature._id);
        l.closePopup();
        const marker: any = markerRef.current;
        marker.closePopup();
        setFeatureProperties(null);
    }
  
    return (
        <Marker
            icon={markerIcon}
            draggable={draggable}
            eventHandlers={eventHandlers}
            position={[props.data.lat, props.data.lng]}
            ref={markerRef}
            >
            <Popup minWidth={90}>
                { editable ? 
                    <input autoFocus type="text" placeholder="Casa, Trabalho..." onKeyDown={handleKeyDown} defaultValue={props.data.name || ""}/> : 
                    <strong>{props.data.name}</strong> 
                }
                <br/>
                {
                    draggable ? 
                    <span>Arraste para outra localização</span> : 
                    editable ?
                    <span>Alterar nome</span> :
                    <>
                    { updatePopupContent(layer) }
                    {/* <div style={{display: "flex", justifyContent: "space-around"}}>
                        <a onClick={toggleEditable} className="marker-popup-link"  href="#">Editar</a> 
                        <a onClick={toggleDraggable} className="marker-popup-link" href="#">Mover</a>
                        <a onClick={() => onRemove()} className="marker-popup-link" href="#">Remover</a>
                    </div> 
                    <a onClick={() => onRemoveFeature()} href="#">Remover da lista</a>*/}
                    </>
                }
            </Popup>
        </Marker>
    )
}

export default UserMarker;