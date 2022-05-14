import React, {createRef} from 'react';
import {MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/Map.css'
import {GeoJSON, Map as LeafletMap} from "leaflet";
import HoveredFeaturePanel from "./HoveredFeaturePanel";
import GeoJsonLayer from "./GeoJsonLayer";

function Map(): JSX.Element {

    let mapRef = createRef<LeafletMap>()
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
            >

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                <GeoJsonLayer mapRef={mapRef} geoJsonLayer={geoJsonLayer}/>

                <HoveredFeaturePanel/>

            </MapContainer>

        </div>

    );

}

export default Map;

