import {createRef, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.styles.css'
import { GeoJSON, Map as LeafletMap } from "leaflet";
/* import HoveredFeaturePanel from "../HoveredFeaturePanel"; */
import GeoJsonLayer from "../geojson-layer/geojson-layer.component";
import Sidebar from '../../WeatherPanel/sidebar/sidebar.component';
import LeafletGeoSearch from '../LeafletGeoSearch';
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import MapLegend from '../map-legend/map-legend.component';
import WeatherPanelStore from '../../../stores/WeatherPanelStore';
import "leaflet-area-select";
import AreaSelect from "../AreaSelect";
import Control from 'react-leaflet-custom-control'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointer, faLocationDot, faMapLocationDot, faObjectGroup } from '@fortawesome/free-solid-svg-icons'
import L from 'leaflet';

function Map() {

    let mapRef = createRef<LeafletMap>();

    const setSelectAreaMode = WeatherPanelStore(state => state.setSelectAreaMode);
    const selectAreaMode = WeatherPanelStore(state => state.selectAreaMode);


    const onSelectAreaMode = (mode?: boolean) => {
        setSelectAreaMode();
    }

   /*  useEffect(() => {
        if (!mapRef || !mapRef.current) return;
        const offset = mapRef.current.getSize().x * 0.25;
        mapRef.current.panBy(new L.Point(offset, 0), {animate: false});
    }, [mapRef]) */

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
                zoomControl={true}
                doubleClickZoom={false}
            >

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <GeoJsonLayer mapRef={mapRef} /> 

                <AreaSelect/>

                <LeafletGeoSearch />

                {/* <Control position='topleft'>
                    <div style={{cursor: 'pointer'}} className="leaflet-bar">
                        <a style={{backgroundColor: selectMode === 'individual' ? '#0d6efd' : ''}} title="Selecionar individualmente" onClick={() => onSetMode('individual')}>
                            <FontAwesomeIcon icon={faHandPointer} />
                        </a>
                    </div>
                </Control> */}

                <Control position='topleft'>
                    <div style={{cursor: 'pointer'}} className="leaflet-bar">
                        <a style={{backgroundColor: selectAreaMode ? '#0d6efd' : ''}} title="Selecionar área" onClick={() => onSelectAreaMode()}>
                            <FontAwesomeIcon icon={faObjectGroup} />
                        </a>
                    </div>
                </Control>

                {/* <Control position='topleft'>
                    <div style={{cursor: 'pointer'}} className="leaflet-bar">
                        <a style={{backgroundColor: selectAreaMode ? '#0d6efd' : ''}} title="Selecionar área" onClick={() => onSelectAreaMode()}>
                            <FontAwesomeIcon icon={faLocationDot} />
                        </a>
                    </div>
                </Control> */}


                {/* <HoveredFeaturePanel/> */}
                
                <MapLegend />

                <Sidebar /> 

            </MapContainer>
        </div>
    );
}

export default Map;