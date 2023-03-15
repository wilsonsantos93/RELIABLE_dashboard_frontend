import {createRef } from 'react';
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
import { faHandPointer, faObjectGroup } from '@fortawesome/free-solid-svg-icons'

function Map() {

    let mapRef = createRef<LeafletMap>();
    let geoJsonLayer = createRef<GeoJSON>();

    /* const setGeoJsonLayerRef = WeatherPanelStore(state => state.setGeoJsonLayerRef);

    useEffect(() => {
        setGeoJsonLayerRef(geoJsonLayer);
    }, [geoJsonLayer]) */

    const setSelectMode = WeatherPanelStore(state => state.setSelectMode);
    const selectMode = WeatherPanelStore(state => state.selectMode);

    const setComparisonMode = WeatherPanelStore(state => state.setComparisonMode);

    const onSetMode = (mode: string) => {
        if (selectMode === mode) {
            setSelectMode(null);
            setComparisonMode(false);
        }
        else {
            setSelectMode(mode);
            setComparisonMode(true);
        }
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

                <GeoJsonLayer mapRef={mapRef} geoJsonLayer={geoJsonLayer}/> 

                <AreaSelect geoJsonLayer={geoJsonLayer} />

                <LeafletGeoSearch geoJsonLayer={geoJsonLayer} style={{zIndex:900}} />

                <Control position='topleft'>
                    <div style={{cursor: 'pointer'}} className="leaflet-bar">
                        <a style={{backgroundColor: selectMode === 'individual' ? '#0d6efd' : ''}} title="Selecionar individualmente" onClick={() => onSetMode('individual')}>
                            <FontAwesomeIcon icon={faHandPointer} />
                        </a>
                    </div>
                </Control>

                <Control position='topleft'>
                    <div style={{cursor: 'pointer'}} className="leaflet-bar">
                        <a style={{backgroundColor: selectMode === 'area' ? '#0d6efd' : ''}} title="Selecionar área" onClick={() => onSetMode('area')}>
                            <FontAwesomeIcon icon={faObjectGroup} />
                        </a>
                    </div>
                </Control>


                {/* <HoveredFeaturePanel/> */}
                
                <MapLegend />

                <Sidebar geoJsonLayer={geoJsonLayer} /> 

            </MapContainer>
        </div>
    );
}

export default Map;