import { Marker, Popup } from "react-leaflet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon, LatLng } from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import "./user-marker.styles.css";
import L from "leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { faEdit, faEyeSlash, faTrash, faUpDownLeftRight } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { removeUserLocation, updateUserLocation } from "../../../store/user/user.action";
import { selectUserLocations } from "../../../store/user/user.selector";
import { selectGeoJsonLayerRef } from "../../../store/refs/refs.selector";
import { selectSelectedWeatherField, selectTableSelectedFeatures } from "../../../store/settings/settings.selector";
import { selectComparedFeatures } from "../../../store/map/map.selector";
import { removeFromComparedFeatures, selectFeature } from "../../../store/map/map.action";
import { updateTableSelectedFeatures } from "../../../store/settings/settings.action";
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

    const dispatch = useDispatch<any>();
    
    const userLocations = useSelector(selectUserLocations);
    const geoJsonLayerRef = useSelector(selectGeoJsonLayerRef);
    const selectedWeatherField = useSelector(selectSelectedWeatherField);
    const comparedFeatures = useSelector(selectComparedFeatures);
    const tableSelectedFeatures = useSelector(selectTableSelectedFeatures);

    const findLayerByLatLng = (latlngPoint: LatLng) => {
        const { lat, lng } = latlngPoint;
        const results = leafletPip.pointInLayer(latlngPoint, geoJsonLayerRef?.current, true);
        if (!results || !results.length) return;
        results.forEach((layer: any) => {
            setLayer(layer);
            layer.fire('click', {
                marker: props.data,
                markerRef: markerRef.current || null,
                latlng: { lat: lat, lng: lng }
            });

            const feature = { 
                _id: layer.feature._id, 
                properties: layer.feature.properties, 
                weather: layer.feature.weather,
                markers: layer.markers,
                marker: props.data || { _id: null }, 
                markerRef: markerRef.current
            }
            dispatch(selectFeature(feature));
        });
    }

    const eventHandlers = useMemo(
        () => ({
            async dragend() {
                const marker: any = markerRef.current;
                if (marker != null) {
                    const loc = { _id: props.data._id, name: props.data.name, position: marker.getLatLng() };
                    dispatch(updateUserLocation(userLocations, loc)).then(() => {
                        toggleDraggable();
                        const { lat, lng } = marker.getLatLng();
                        const latlngPoint = new L.LatLng(lat, lng);
                        findLayerByLatLng(latlngPoint);
                    });
                }
            },

            click() {
                if (!geoJsonLayerRef) return;
                const marker: any = markerRef.current;
                if (marker == null) return;
                const { lat, lng } = marker.getLatLng();
                const latlngPoint = new L.LatLng(lat, lng);
                findLayerByLatLng(latlngPoint);
            },
        }), 
        [geoJsonLayerRef, comparedFeatures, userLocations]
    );


    
    useEffect(() => {
        const marker: any = markerRef.current;
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
                {/* <Button onClick={() => onRemoveFeature()}  title="Remover da lista" variant="outline-danger" size="sm"><FontAwesomeIcon icon={faEyeSlash}/></Button> */}
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
            dispatch(updateUserLocation(userLocations, { _id: props.data._id, name: target.value, position: props.data.position }));
            toggleEditable();
        }
    }

    const onRemove = () => {
        if (!geoJsonLayerRef) return;
        const l = geoJsonLayerRef.current.getLayer(layer.feature._id);
        if (!l) return;
        dispatch(removeUserLocation(userLocations, props.data._id)).then(() => {
            const l = geoJsonLayerRef.current.getLayer(layer.feature._id);
            if (l) l.closePopup();
            const marker: any = markerRef.current;
            if (marker) marker.closePopup();
            dispatch(selectFeature(null));
        });
    }

    /* const onRemoveFeature = () => {
        if (!layer || !geoJsonLayerRef) return;

        dispatch(removeFromComparedFeatures(comparedFeatures, layer.feature._id));
        const l = geoJsonLayerRef.current.getLayer(layer.feature._id);
        l.closePopup();
        const marker: any = markerRef.current;
        marker.closePopup();
        dispatch(selectFeature(null));
    } */
  
    return (
        <Marker
            icon={markerIcon}
            draggable={draggable}
            eventHandlers={eventHandlers}
            position={[props.data.position.lat, props.data.position.lng]}
            ref={markerRef}
            >
            <Popup minWidth={90}>
                { editable ? 
                    <input autoFocus type="text" placeholder="Casa, Trabalho..." onKeyDown={handleKeyDown} defaultValue={props.data.name || ""}/> : 
                    <strong>{props.data.name || "Sem nome"}</strong> 
                }
                <br/>
                {
                    draggable ? 
                    <span>Arraste para outra localização</span> : 
                    editable ?
                    <div>
                        <span>Alterar nome</span><br/>
                        <a href="#" onClick={() => toggleEditable()}>Cancelar</a>
                    </div> :
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