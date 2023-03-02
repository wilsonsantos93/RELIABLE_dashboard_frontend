import {createRef, useEffect} from 'react';
import {MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/Map.css'
import {GeoJSON, Map as LeafletMap} from "leaflet";
import HoveredFeaturePanel from "./HoveredFeaturePanel";
import GeoJsonLayer from "./GeoJsonLayer";
import Sidebar from '../WeatherPanel/Sidebar';
import LeafletGeoSearch from './LeafletGeoSearch';
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";

function Map() {

    let mapRef = createRef<LeafletMap>();
    let geoJsonLayer = createRef<GeoJSON>(); //https://github.com/PaulLeCam/react-leaflet/issues/332

    return (
        <div>
            <MapContainer
                ref={mapRef}
                preferCanvas={true}
                center={[38.686796, -9.128914]}
                zoom={8}
                scrollWheelZoom={true}
                bounceAtZoomLimits={true}
                attributionControl={false}
                minZoom={4}
                maxBounds={[[-90, -180], [90, 180]]}
                maxBoundsViscosity={0.8}
                fullscreenControl={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <GeoJsonLayer mapRef={mapRef} geoJsonLayer={geoJsonLayer}/> 

                <LeafletGeoSearch geoJsonLayer={geoJsonLayer} style={{zIndex:900}} />

                <HoveredFeaturePanel/>

                <Sidebar /> 

            </MapContainer>
        </div>
    );
}

export default Map;