import React, {useEffect, useState} from 'react';
import {GeoJSON, LayerGroup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/Map.css'
import {Feature, GeoJsonObject, Geometry} from "geojson";
import {fetchGeoJSON} from "../../data/fetchGeoJSON";
import {Layer, LeafletMouseEvent, Map as LeafletMap, PathOptions} from "leaflet";
import {MapFeatureStyle} from "../../styles/MapFeatureStyle";
import {GeoJsonLayerProperties} from "../../models/components/GeoJsonLayerProperties";
import WeatherPanelStore from "../../stores/WeatherPanelStore";
import {FeatureProperties} from "../../models/FeatureProperties";
import HoveredFeatureStore from "../../stores/HoveredFeatureStore";
import {fetchWeatherGeoJSON} from "../../data/fetchWeatherGeoJSON";

function GeoJsonLayer(props: GeoJsonLayerProperties): JSX.Element {

    const selectedInformationType = WeatherPanelStore(state => state.selectedInformation)
    const selectedDateDatabaseId = WeatherPanelStore(state => state.selectedDateDatabaseId)

    const setFeatureProperties = HoveredFeatureStore(state => state.setFeatureProperties)

    /**
     * Returns the style of a feature in the map.
     * @param feature The feature to return the style of.
     */
    function getStyle(feature: Feature<Geometry, { "weather": any }>) {

        let featureColor = "#808080";

        if ("weather" in feature && feature.properties.weather && selectedInformationType === "Temperature") {
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

    /**
     * Fetch and update geoJSON
     */
    const [geoJSON, setGeoJSON] = useState<GeoJsonObject | null>(null);
    // useEffect(() => {
    //     if (!geoJSON) {
    //         (async () => {
    //             let fetchedGeoJSON = await fetchGeoJSON();
    //             setGeoJSON(fetchedGeoJSON)
    //             if (props.geoJsonLayer.current) {
    //                 props.geoJsonLayer.current.clearLayers().addData(fetchedGeoJSON);
    //             }
    //         })()
    //     }
    // }, [])

    useEffect(() => {
        if (selectedInformationType && selectedDateDatabaseId) {
            (async () => {
                let fetchedGeoJSON = await fetchWeatherGeoJSON(selectedDateDatabaseId);
                setGeoJSON(fetchedGeoJSON)
                if (props.geoJsonLayer.current) {
                    props.geoJsonLayer.current.clearLayers().addData(fetchedGeoJSON);
                }
            })()
        }
        else {
            (async () => {
                let fetchedGeoJSON = await fetchGeoJSON();
                setGeoJSON(fetchedGeoJSON)
                if (props.geoJsonLayer.current) {
                    props.geoJsonLayer.current.clearLayers().addData(fetchedGeoJSON);
                }
            })()
        }
    }, [selectedInformationType, selectedDateDatabaseId])

    // Zooms to the feature clicked
    function zoomToFeature(event: LeafletMouseEvent, map: LeafletMap | null) {
        if (map !== null) {
            map.fitBounds(event.target.getBounds());
        }
    }

    /**
     * Resets the highlight a feature of the map when hovered over.
     * @param event The event when a feature is hovered over.
     * @param setMapFeatureInformation The function that sets the state of the panel with the feature's information.
     */
    function resetHighlightFeature(event: LeafletMouseEvent) {

        let mapFeatureHoveredEvent = event.target;
        let mapFeatureHovered = mapFeatureHoveredEvent.feature;

        setFeatureProperties(mapFeatureHovered.properties);

        // For some reason, without sleeping, the map feature is highlighted only from a brief moment.
        function sleep(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        sleep(10).then(_ => {
            let mapFeatureHoveredStyle: MapFeatureStyle = {
                weight: 2,
                dashArray: "3",
            }
            mapFeatureHoveredEvent.setStyle(mapFeatureHoveredStyle);
            mapFeatureHoveredEvent.bringToFront();
        })


    }

    /**
     * Highlights a feature of the map when hovered over.
     * @param event The event when a feature is hovered over.
     * @param setMapFeatureInformation The function that sets the state of the panel with the feature's information.
     */
    function highlightFeature(event: LeafletMouseEvent) {

        let mapFeatureHoveredEvent = event.target;
        let mapFeatureHovered = mapFeatureHoveredEvent.feature;

        setFeatureProperties(mapFeatureHovered.properties);

        // For some reason, without sleeping, the map feature is highlighted only from a brief moment.
        function sleep(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        sleep(10).then(_ => {
            let mapFeatureHoveredStyle: MapFeatureStyle = {
                weight: 5,
                dashArray: "",
            }
            mapFeatureHoveredEvent.setStyle(mapFeatureHoveredStyle);
            mapFeatureHoveredEvent.bringToFront();
        })


    }

    /**
     * The events associated with each feature
     */
    function onEachFeature(feature: Feature<Geometry, FeatureProperties>, layer: Layer, map: LeafletMap | null) {

        layer.on({
            mouseover: (event) => {
                highlightFeature(event)
            },
            mouseout: (event) => {
                resetHighlightFeature(event)
            },
            click: (event) => {
                zoomToFeature(event, map)
            },
        });

    }

    return (

        <LayerGroup>

            <GeoJSON
                ref={props.geoJsonLayer}
                data={geoJSON as GeoJsonObject}
                onEachFeature={(feature, layer) => onEachFeature(feature, layer, props.mapRef.current)}
                // @ts-ignore
                style={getStyle}
            />

        </LayerGroup>

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

export default GeoJsonLayer;

