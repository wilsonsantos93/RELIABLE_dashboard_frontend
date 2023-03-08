import { useCallback, useEffect, useState} from 'react';
import {GeoJSON, LayerGroup, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {Feature, GeoJsonObject, Geometry} from "geojson";
import {fetchGeoJSON} from "../../../data/fetchGeoJSON";
import {LatLng, Layer, LayerEvent, LeafletMouseEvent, Map as LeafletMap, PathOptions, PopupOptions} from "leaflet";
import {MapFeatureStyle} from "../../../types/MapFeatureStyle";
import {GeoJsonLayerProperties} from "../../../types/components/GeoJsonLayerProperties";
import WeatherPanelStore from "../../../stores/WeatherPanelStore";
import {FeatureProperties} from "../../../types/FeatureProperties";
import HoveredFeatureStore from "../../../stores/HoveredFeatureStore";
import {fetchWeatherGeoJSON} from "../../../data/fetchWeatherGeoJSON";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import "@mapbox/leaflet-pip";
import { useStableCallback } from '../../../hooks/UseStableCallback';

let clickedFeatureId: any = null;

const GeoJsonLayer = (props: any) => {

    const weatherFields = WeatherPanelStore(state => state.weatherFields);
    const selectedWeatherField = WeatherPanelStore(state => state.selectedInformation);

    const selectedDateId = WeatherPanelStore(state => state.selectedDateDatabaseId);

    const setFeatureProperties = HoveredFeatureStore(state => state.setFeatureProperties);
    const hoveredFeature = HoveredFeatureStore(state => state.featureProperties);

    /* const setClickedFeature = WeatherPanelStore(state => state.setClickedFeature);
    const clickedFeature = WeatherPanelStore(state => state.clickedFeature) */

/*     const [currentlyRenderingGeoJsonWeather, setCurrentlyRenderingGeoJsonWeather] = useState(false);
    const [lastDateRendered, setLastDateRendered] = useState(""); */

    const [previousLayer, setPreviousLayer] = useState<any>(null);

    /* const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
    const markerIcon = new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]}); */



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
            color: "black",
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
                }
            }
        })()
    }, [selectedDateId]);

    useEffect(() => {
        if (geoJSON) setLoading(false);
     }, [geoJSON])

    /* useEffect(() => {
        if (previousLayer) {
            previousLayer.setStyle({
                color:'white',
                weight: 2,
                dashArray: "3",
            });
        }
    }, [clickedFeature]) */

    useEffect(() => {
        if (!hoveredFeature) return
        const keys = Object.keys(props.geoJsonLayer.current._layers);
        for (const key of keys) {
            if (props.geoJsonLayer.current._layers[key].feature._id != hoveredFeature._id) continue;
            const layer = props.geoJsonLayer.current._layers[key];
            setLayerStyle(layer, {
                weight: 6,
                color: "black",
                dashArray: "",
            });
            break;
        }
    }, [hoveredFeature])


    const setLayerStyle = (layer: any, style: MapFeatureStyle) => {
        sleep(10).then(_ => {
            layer.setStyle(style);
            layer.bringToFront();
        });
        return;
    }


    const setComparedFeatures = WeatherPanelStore(state => state.setComparedFeatures);
    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);

    const comparisonMode = WeatherPanelStore(state => state.comparisonMode);

    const createPopupContent = (event: any) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <strong>${event.target.feature.properties.Concelho}</strong><br>
            <span>${selectedWeatherField?.displayName}</span>
            <span>${selectedWeatherField && event.target.feature.weather ? event.target.feature.weather[selectedWeatherField.name] : ''} ${selectedWeatherField.unit}</span>
            <br/>
        `;

        if (comparisonMode) {
            const comparedFeaturesFiltered = comparedFeatures.find((f:any) => f._id == event.target.feature._id);
            const button = document.createElement("a");
            button.href = "#";
            if (!comparedFeaturesFiltered) {
                button.innerHTML = "Adicionar à comparação";
                //button.className = "btn btn-sm btn-primary";
                button.onclick = function() {
                    setComparedFeatures([...comparedFeatures, event.target.feature]);
                    event.target.closePopup();
                    highlightFeature(event);
                }
            }
            else {
                const filteredFeatures = comparedFeatures.filter((f:any) => f._id != event.target.feature._id);
                //if (filteredFeatures.length) {
                    button.innerHTML = "Remover da comparação";
                    //button.className = "btn btn-sm btn-danger";
                    button.onclick = function() {
                        setComparedFeatures(filteredFeatures);
                        event.target.closePopup();
                        resetHighlightFeature(event);
                    }
                //}
            }
            div.appendChild(button);
        }
       
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

        /* console.log("hover", mapFeatureHovered._id, "clicked", clickedFeatureId)
        if (mapFeatureHovered._id === clickedFeatureId) {
            console.log("Not reset style")
            return;
        } */

        const exists = comparedFeatures.find((feature: any) => feature._id == mapFeatureHovered._id)
        if (exists) {
            console.log("Already exists, keeping style") 
            return;
        }

        // For some reason, without sleeping, the map feature is highlighted only from a brief moment.
        sleep(10).then(_ => {
            const mapFeatureHoveredStyle: MapFeatureStyle = {
                weight: 2,
                color: 'black',
                dashArray: "3",
            }
            mapFeatureHoveredEvent.setStyle(mapFeatureHoveredStyle);
            mapFeatureHoveredEvent.bringToFront();
            console.log("Resetting style", mapFeatureHovered.properties.Concelho)
            return;
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

        /* setFeatureProperties({
            _id: mapFeatureHovered._id, 
            properties: mapFeatureHovered.properties, 
            weather: mapFeatureHovered.weather
        }); */

        // For some reason, without sleeping, the map feature is highlighted only from a brief moment.
        sleep(10).then(_ => {
            const mapFeatureHoveredStyle: MapFeatureStyle = {
                weight: 6,
                color: "black",
                dashArray: "",
            }
            mapFeatureHoveredEvent.setStyle(mapFeatureHoveredStyle);
            mapFeatureHoveredEvent.bringToFront();
            console.log("higlight feature!", mapFeatureHovered.properties.Concelho);
            return;
        })
    }


    const addMarker = (event: LeafletMouseEvent, layer: Layer) => {
        //setMarkerPosition(event.latlng);
        /* layer.setPopupContent(`
            <strong>${event.target.feature.properties.Concelho}</strong><br/>
            <span>${selectedWeatherField?.displayName}</span>
            <span>${selectedWeatherField && event.target.feature.weather ? event.target.feature.weather[selectedWeatherField.name] : ''} ${selectedWeatherField.unit}</span>
        `) */

        layer.setPopupContent(createPopupContent(event))
    }

    const setClickedFeatureId = (event: LeafletMouseEvent) => {
        //if (!event.target) return;
        //setPreviousLayer(event.target);
        clickedFeatureId = event.target.feature._id;
        const feature = { 
            _id: event.target.feature._id, 
            properties: event.target.feature.properties,
            weather: event.target.feature.weather 
        };
        setFeatureProperties(feature);
        //setClickedFeature(feature);
        if (!comparisonMode) setComparedFeatures([feature]);
    }

    const newAddMarker = useStableCallback(addMarker);
    const newSetClickedFeatureId = useStableCallback(setClickedFeatureId);
    const newResetHighlightFeature = useStableCallback(resetHighlightFeature);


    /* const openPopup = (event: any, layer: Layer) => {
        //event.latlng 
        layer.openPopup();
    } */


    /**
     * The events associated with each feature
     */
    const onEachFeature = (feature: any, layer: Layer, map: LeafletMap | null) => {
        layer.bindPopup(`<strong>${feature.properties.Concelho}</strong><br/>`);
        layer.on({
            mouseover: (event) => {
                highlightFeature(event);
                //newAddMarker(event, layer);
                //openPopup(event, layer);
            },
            mouseout: (event) => {
                newResetHighlightFeature(event);
            },
            click: (event) => {
                newSetClickedFeatureId(event);
                newAddMarker(event, layer);
                highlightFeature(event);
                //zoomToFeature(event, map);
                /* var elem = document.getElementById("row_"+feature._id);  
                if (elem) elem.scrollIntoView(true);  */
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

export default GeoJsonLayer;