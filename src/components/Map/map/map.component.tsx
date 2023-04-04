import { createRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './map.styles.css'
import { Map as LeafletMap } from "leaflet";
import GeoJsonLayer from "../geojson-layer/geojson-layer.component";
import Sidebar from '../../WeatherPanel/sidebar/sidebar.component';
import LeafletGeoSearch from '../geosearch/leaflet-geosearch.component';
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import MapLegend from '../map-legend/map-legend.component';
import "leaflet-area-select";
import AreaSelect from "../area-select/area-select.component";
import Control from 'react-leaflet-custom-control'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faObjectGroup } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux';
import { selectAreaMode } from '../../../store/settings/settings.selector';
import { setAreaMode } from '../../../store/settings/settings.action';
import DateIndicator from '../date-indicator/date-indicator.component';

function Map() {

    let mapRef = createRef<LeafletMap>();

    const areaMode = useSelector(selectAreaMode);
    const dispatch = useDispatch<any>();

    const onSelectAreaMode = () => {
        dispatch(setAreaMode(!areaMode));
    }

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

                <Control position='topleft'>
                    <div style={{cursor: 'pointer'}} className="leaflet-bar">
                        <a style={{backgroundColor: areaMode ? '#0d6efd' : ''}} title="Selecionar área" onClick={() => onSelectAreaMode()}>
                            <FontAwesomeIcon icon={faObjectGroup} />
                        </a>
                    </div>
                </Control>
                
                <MapLegend />
                
                <Sidebar /> 

                <DateIndicator />

            </MapContainer>
        </div>
    );
}

export default Map;