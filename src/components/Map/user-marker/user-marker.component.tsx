import { Marker, Popup } from "react-leaflet";
import { useCallback, useMemo, useRef, useState } from "react";
import { Icon } from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import UserMarkerStore from "../../../stores/UserMarkerStore";
import "./user-marker.styles.css";
import WeatherPanelStore from "../../../stores/WeatherPanelStore";
import L from "leaflet";
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
    //const [position, setPosition] = useState(null);
    const markerRef = useRef(null);

    /* const setUserMarkers = UserMarkerStore(state => state.setUserMarkers);
    const userMarkers = UserMarkerStore(state => state.userMarkers); */

    const removeUserMarker = UserMarkerStore(state => state.removeUserMarker);
    const upsertUserMarker = UserMarkerStore(state => state.upsertUserMarker);

    const geoJsonLayerRef = WeatherPanelStore(state => state.geoJsonLayerRef);

    const eventHandlers = useMemo(
        () => ({
            async dragend() {
                const marker: any = markerRef.current;
                if (marker != null) {
                    await upsertUserMarker(props.data._id, undefined, marker.getLatLng);
                    //setPosition(marker.getLatLng());
                    toggleDraggable();
                }
            },

            click() {
                const latlngPoint = new L.LatLng(props.data.lat, props.data.lng);
                const results = leafletPip.pointInLayer(latlngPoint, geoJsonLayerRef.current, true);
                results.forEach(function(layer: any) {
                    layer.fire('click');/* , {
                        latlng: latlngPoint
                    }); */
                });
            },

            mouseover() {
                const marker: any = markerRef.current;
                marker?.openPopup();
            }
        }),
        [geoJsonLayerRef],
    );

    const toggleDraggable = useCallback(() => {
        setDraggable((d) => !d)
    }, []);

    const toggleEditable = useCallback(() => {
        setEditable((e) => !e)
    }, []);

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const target = e.target as any;
            await upsertUserMarker(props.data._id, target.value);
            toggleEditable();
        }
    }

    const onRemove = () => {
        removeUserMarker(props.data._id);
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
                <input type="text" placeholder="Casa, Trabalho..." onKeyDown={handleKeyDown} defaultValue={props.data.name}/> : 
                <strong>{props.data.name}</strong> }
                <br/>
                {
                    draggable ? 
                    <span>Arraste para outra localização</span> : 
                    editable ?
                    <span>Alterar nome</span> :
                    <div style={{display: "flex", justifyContent: "space-around"}}>
                        <a className="marker-popup-link" onClick={toggleEditable} href="#">Editar</a> 
                        <a onClick={toggleDraggable} className="marker-popup-link" href="#">Mover</a>
                        <a onClick={() => onRemove()} className="marker-popup-link" href="#">Remover</a>
                    </div>
                }
            </Popup>
        </Marker>
    )
}

export default UserMarker;