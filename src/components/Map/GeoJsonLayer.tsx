import { useCallback, useEffect, useState} from 'react';
import {GeoJSON, LayerGroup, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/Map.css'
import {Feature, GeoJsonObject, Geometry} from "geojson";
import {fetchGeoJSON} from "../../data/fetchGeoJSON";
import {LatLng, Layer, LayerEvent, LeafletMouseEvent, Map as LeafletMap, PathOptions, PopupOptions} from "leaflet";
import {MapFeatureStyle} from "../../styles/MapFeatureStyle";
import {GeoJsonLayerProperties} from "../../models/components/GeoJsonLayerProperties";
import WeatherPanelStore from "../../stores/WeatherPanelStore";
import {FeatureProperties} from "../../models/FeatureProperties";
import HoveredFeatureStore from "../../stores/HoveredFeatureStore";
import {fetchWeatherGeoJSON} from "../../data/fetchWeatherGeoJSON";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import "@mapbox/leaflet-pip";
import { useStableCallback } from '../UseStableCallback';
import { create } from 'domain';

const GeoJsonLayer = (props: any) => {

    const weatherFields = WeatherPanelStore(state => state.weatherFields);
    const selectedWeatherField = WeatherPanelStore(state => state.selectedInformation);

    const selectedDateId = WeatherPanelStore(state => state.selectedDateDatabaseId);

    const setFeatureProperties = HoveredFeatureStore(state => state.setFeatureProperties);

    const setClickedFeature = WeatherPanelStore(state => state.setClickedFeature);
    const clickedFeature = WeatherPanelStore(state => state.clickedFeature)

    const [currentlyRenderingGeoJsonWeather, setCurrentlyRenderingGeoJsonWeather] = useState(false);
    const [lastDateRendered, setLastDateRendered] = useState("");

    const [previousLayer, setPreviousLayer] = useState<any>(null);

    /* const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
    const markerIcon = new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]}); */

    let clickedFeatureId: any = null;

    const setLoading = WeatherPanelStore(state => state.setLoading);
    //const setData = WeatherPanelStore(state => state.setData);

    // Get color for depending on value
    const getColor = (value: number) => {
        const field = weatherFields.find(field => field.name === selectedWeatherField.name);
        if (field) {
            for (let r of field.colours) {
                if (r.min <= value && value < r.max) return r.colour
            }
        }
        return "#808080";
    }

    /**
     * Returns the style of a feature in the map.
     * @param feature The feature to return the style of.
     */
    const getStyle = (feature: any) => {
        let featureColor = "#808080";

        if (selectedWeatherField && feature.weather) {
            featureColor = getColor(feature.weather[selectedWeatherField.name]);
        }

        const mapFeatureNotHoveredStyle: MapFeatureStyle = {
            fillColor: featureColor,
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.5,
        };

        return mapFeatureNotHoveredStyle as PathOptions;
    }

    /**
     * Fetch and update geoJSON
     */
    const [geoJSON, setGeoJSON] = useState<GeoJsonObject | null>(null);

    useEffect(() => {
        (async () => {
            if (selectedDateId) {
                setLoading(true);
                const data = await fetchWeatherGeoJSON(selectedDateId);
                setGeoJSON(data);
                if (props.geoJsonLayer.current) {
                    props.geoJsonLayer.current.clearLayers().addData(data);
                    /* setCurrentlyRenderingGeoJsonWeather(true);
                    setLastDateRendered(selectedDateId);
                    setCurrentlyRenderingGeoJsonWeather(true); */
                }
            }
        })()
    }, [selectedDateId]);

    useEffect(() => {
        if (geoJSON) setLoading(false);
     }, [geoJSON])

     useEffect(() => {
        if (previousLayer) {
            previousLayer.setStyle({
                color:'white',
                weight: 2,
                dashArray: "3",
            });
        }
     }, [clickedFeature])


    const setComparedFeatures = WeatherPanelStore(state => state.setComparedFeatures);
    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);

    const createPopupContent = (event: any, layer: Layer) => {
        const div = document.createElement("div");
        div.innerHTML = `<br>${event.target.feature.properties.Concelho}<br>`;

        const button = document.createElement("button");
        button.innerHTML = "Adicionar à comparação";

        button.onclick = function() {
            console.log("Adicionar à comparação", event.target.feature.properties.Concelho)
            setComparedFeatures([...comparedFeatures, event.target.feature])
        }

        div.appendChild(button);
        return div;
    }


    // Zooms to the feature clicked
    const zoomToFeature = (event: LeafletMouseEvent, map: LeafletMap | null) => {
        if (map !== null) {
            //map.fitBounds(event.target.getBounds());
            const currentZoom = map.getZoom();
            let zoom = 9;
            if (currentZoom >= zoom) {
               zoom = currentZoom;
            }
            map.setView(event.latlng, zoom);
        }
    }

    const sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Resets the highlight a feature of the map when hovered over.
     * @param event The event when a feature is hovered over.
     * @param setMapFeatureInformation The function that sets the state of the panel with the feature's information.
     */
    const resetHighlightFeature = (event: LeafletMouseEvent) => {

        const mapFeatureHoveredEvent = event.target;
        const mapFeatureHovered = mapFeatureHoveredEvent.feature;

        setFeatureProperties({});

        if (mapFeatureHovered._id === clickedFeatureId) {
            return;
        }

        //setFeatureProperties(mapFeatureHovered.properties);
        //setFeatureProperties({properties: mapFeatureHovered.properties, weather: mapFeatureHovered.weather});
        
        // For some reason, without sleeping, the map feature is highlighted only from a brief moment.
        sleep(10).then(_ => {
            const mapFeatureHoveredStyle: MapFeatureStyle = {
                weight: 2,
                color: 'white',
                dashArray: "3",
            }
            mapFeatureHoveredEvent.setStyle(mapFeatureHoveredStyle);
            mapFeatureHoveredEvent.bringToFront();
        });
    }

    /**
     * Highlights a feature of the map when hovered over.
     * @param event The event when a feature is hovered over.
     * @param setMapFeatureInformation The function that sets the state of the panel with the feature's information.
     */
    const highlightFeature = (event: LeafletMouseEvent) => {

        let mapFeatureHoveredEvent = event.target;
        let mapFeatureHovered = mapFeatureHoveredEvent.feature;

        //setFeatureProperties(mapFeatureHovered.properties);
        setFeatureProperties({properties: mapFeatureHovered.properties, weather: mapFeatureHovered.weather});

        // For some reason, without sleeping, the map feature is highlighted only from a brief moment.
        sleep(10).then(_ => {
            const mapFeatureHoveredStyle: MapFeatureStyle = {
                weight: 6,
                color:"white",
                dashArray: "",
            }
            mapFeatureHoveredEvent.setStyle(mapFeatureHoveredStyle);
            mapFeatureHoveredEvent.bringToFront();
        })
    }

    const addToComparison = () => {
        console.log("add to comparison");
    }


    const addMarker = (event: LeafletMouseEvent, layer: Layer) => {
        //setMarkerPosition(event.latlng);
        /* layer.setPopupContent(`
            <strong>${event.target.feature.properties.Concelho}</strong><br/>
            <span>${selectedWeatherField?.displayName}</span>
            <span>${selectedWeatherField && event.target.feature.weather ? event.target.feature.weather[selectedWeatherField.name] : ''} ${selectedWeatherField.unit}</span>
        `) */

        layer.setPopupContent(createPopupContent(event, layer))
        //layer.setTooltipContent(createPopupContent(event, layer))
    }

    const setClickedFeatureId = (event: LeafletMouseEvent) => {
        if (!event.target) return;
        setPreviousLayer(event.target);
        clickedFeatureId = event.target.feature._id;
        const feature = { properties: event.target.feature.properties, weather: event.target.feature.weather };
        setClickedFeature(feature);
    }

    const newAddMarker = useStableCallback(addMarker);

    const openPopup = (event: any, layer: Layer) => {
        layer.openPopup(/* event.latlng */);
        //layer.openTooltip()
    }



    /**
     * The events associated with each feature
     */
    const onEachFeature = (feature: any, layer: Layer, map: LeafletMap | null) => {
        layer.bindPopup(`<strong>${feature.properties.Concelho}</strong><br/>`, { autoClose: true });
        //layer.bindTooltip(`<strong>${feature.properties.Concelho}</strong><br/>`, {sticky: true})
        layer.on({
            mouseover: (event) => {
                highlightFeature(event);
                newAddMarker(event, layer);
                openPopup(event, layer);
            },
            mouseout: (event) => {
                resetHighlightFeature(event);
            },
            click: (event) => {
                setClickedFeatureId(event);
                newAddMarker(event, layer);
                highlightFeature(event);
                zoomToFeature(event, map);
                //openPopup(layer);
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

            {/* { markerPosition && 
                <Marker icon={markerIcon} position={markerPosition}> 
                    <Popup>
                        { 
                            selectedWeatherField ?
                            <>
                            <span>{selectedWeatherField}: {featureProperties.weather[selectedWeatherField]}</span>
                            <a href="#">Guardar localização</a> 
                            </> : null
                        }
                    </Popup>
                </Marker>
            } */}
        </LayerGroup>
    );

}

/**
 * Returns the temperature of a given color.
 * @param temperature The temperature to return the color of.
 */
function getTemperatureColor(temperature: number | null) {

    if (!temperature) return "#808080";

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

/**
 * Returns the wind speed of a given color.
 * @param windSpeed The temperature to return the color of.
 */
function getWindSpeedColor(windSpeed: number) {

    if (windSpeed > 40) return "#4d004b"
    if (windSpeed > 35) return "#810f7c"
    if (windSpeed > 30) return "#88419d"
    if (windSpeed > 25) return "#8c6bb1"
    if (windSpeed > 20) return "#8c96c6"
    if (windSpeed > 15) return "#9ebcda"
    if (windSpeed > 10) return "#bfd3e6"
    if (windSpeed > 5) return "#e0ecf4"
    if (windSpeed > 0) return "#f7fcfd"
    return "#4d004b"
}

export default GeoJsonLayer;