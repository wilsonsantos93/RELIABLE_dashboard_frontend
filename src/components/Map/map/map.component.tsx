import {createRef } from 'react';
import {MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.styles.css'
import {GeoJSON, Map as LeafletMap} from "leaflet";
import HoveredFeaturePanel from "../HoveredFeaturePanel";
import GeoJsonLayer from "../geojson-layer/geojson-layer.component";
import Sidebar from '../../WeatherPanel/sidebar/sidebar.component';
import LeafletGeoSearch from '../LeafletGeoSearch';
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";

function Map() {

    let mapRef = createRef<LeafletMap>();
    let geoJsonLayer = createRef<GeoJSON>();

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
                doubleClickZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <GeoJsonLayer mapRef={mapRef} geoJsonLayer={geoJsonLayer}/> 

                <LeafletGeoSearch geoJsonLayer={geoJsonLayer} style={{zIndex:900}} />

                {/* <HoveredFeaturePanel/> */}

                <Sidebar /> 

            </MapContainer>
        </div>
    );
}

export default Map;