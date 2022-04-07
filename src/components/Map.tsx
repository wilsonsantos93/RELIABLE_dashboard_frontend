import React, {createRef, useEffect, useState} from 'react';
import {GeoJSON, LayerGroup, MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css'
import {Feature, GeoJsonObject, Geometry} from "geojson";
import {fetchGeoJSON} from "../data/fetchGeoJSON";
import {onEachFeature} from "../events/mapEvents";
import {PanelProperties} from "../models/WeatherPanelProperties";
import {GeoJSON as geoJSONLayer, Map as LeafletMap, PathOptions} from "leaflet";
import MapFeatureInformation from "./MapFeatureInformation";
import {MapFeatureStyle} from "../styles/MapFeatureStyle";

function Map(props: PanelProperties): JSX.Element {


    /**
     * Returns the style of a feature in the map.
     * @param feature The feature to return the style of.
     */
    function getStyle(feature: Feature<Geometry, { "weather": any }>) {

        let featureColor = "#808080";

        if ("weather" in feature && feature.properties.weather && props.selectedInfo === "Temperature") {
            featureColor = getTemperatureColor(feature.properties.weather.current.temp_c);
        }

        let mapFeatureNotHoveredStyle: MapFeatureStyle = {
            fillColor: featureColor,
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.7,
        };

        return mapFeatureNotHoveredStyle as PathOptions;
    }

    let mapRef = createRef<LeafletMap>()
    let geoJSONRef = createRef<geoJSONLayer>()


    /**
     * Fetch and update geoJSON
     */
    const [geoJSON, setGeoJSON] = useState<GeoJsonObject>();
    useEffect(() => {

        if (!geoJSON) {

            (async () => {
                setGeoJSON(await fetchGeoJSON() as GeoJsonObject)
            })()

        }

    })

    /**
     * Create geoJSON layer.
     */
    const [mapFeatureInformation, setMapFeatureInformation] = useState<string>("No weather");
    let geoJSONLayer;
    if (geoJSON) {
        geoJSONLayer = <GeoJSON
            ref={geoJSONRef}
            data={geoJSON}
            onEachFeature={(feature, layer) => onEachFeature(feature, layer, setMapFeatureInformation)}
            // @ts-ignore
            style={getStyle}
        />
    }


    return (

        <div>

            <MapContainer
                ref={mapRef}
                center={[38.686796, -9.128914]}
                zoom={8}
                scrollWheelZoom={true}
                bounceAtZoomLimits={true}
                attributionControl={false}
                minZoom={4}
                maxBounds={[[-90, -180],[90, 180]]}
                maxBoundsViscosity={0.8}

            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LayerGroup>
                    {geoJSONLayer}
                </LayerGroup>

                <MapFeatureInformation mapFeatureInformation={mapFeatureInformation}/>

            </MapContainer>

        </div>

    );

}

/**
 * Returns the temperature of a given color.
 * @param temperature The temperature to return the color of.
 */
function getTemperatureColor(temperature: number) {

    if (temperature > 40) return "#800026"
    if (temperature > 35) return "#BD0026"
    if (temperature > 30) return "#E31A1C"
    if (temperature > 25) return "#FC4E2A"
    if (temperature > 20) return "#FD8D3C"
    if (temperature > 15) return "#FEB24C"
    if (temperature > 10) return "#FED976"
    if (temperature > 5) return "#FFEDA0"
    if (temperature > 0) return "#FFFFFF"
    if (temperature > -5) return "#f7fcfd"
    if (temperature > -10) return "#e0ecf4"
    if (temperature > -15) return "#bfd3e6"
    if (temperature > -20) return "#9ebcda"
    if (temperature > -25) return "#8c96c6"
    if (temperature > -30) return "#8c6bb1"
    if (temperature > -30) return "#88419d"
    if (temperature > -35) return "#810f7c"
    return "#4d004b"
}

export default Map;

