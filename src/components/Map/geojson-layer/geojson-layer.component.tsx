import { useCallback, useEffect, useState} from 'react';
import {GeoJSON, LayerGroup, Marker, Popup, useMap} from 'react-leaflet';
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

type CustomLayer = { feature: any, _leaflet_id: string } & Layer;

const layerHighlightedStyle: MapFeatureStyle = {
    color: "black",
    weight: 3
}

const layerRedHighlightedStyle: MapFeatureStyle = {
    ...layerHighlightedStyle,
    color: "red",
}

const layerNormalStyle: MapFeatureStyle = {
    color: "#a2a2a2",
    weight: 1
}

let clickedFeatureId: string | null = null;

const GeoJsonLayer = (props: any) => {
    const [geoJSON, setGeoJSON] = useState<GeoJsonObject | null>(null);

    const weatherFields = WeatherPanelStore(state => state.weatherFields);
    const selectedWeatherField = WeatherPanelStore(state => state.selectedInformation);

    const selectedDateId = WeatherPanelStore(state => state.selectedDateDatabaseId);

    const setFeatureProperties = HoveredFeatureStore(state => state.setFeatureProperties);
    const hoveredFeature = HoveredFeatureStore(state => state.featureProperties);

    const [previousLayer, setPreviousLayer] = useState<any>(null);

    const setComparedFeatures = WeatherPanelStore(state => state.setComparedFeatures);
    const comparedFeatures = WeatherPanelStore(state => state.comparedFeatures);

    const comparisonMode = WeatherPanelStore(state => state.comparisonMode);

    const setLoading = WeatherPanelStore(state => state.setLoading);

    const map = useMap();

    /* const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
    const markerIcon = new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]}); */

    // Get color for depending on value
    const getColor = (value: number) => {
        const field = weatherFields.find(field => field.name === selectedWeatherField.name);
        if (field) {
            for (let r of field.colours) {
                const min = r.min != null ? r.min : -Infinity; 
                const max = r.max != null ? r.max : Infinity;
                if (min <= value && value < max) return r.colour
            }
        }
        return "#808080";
    }

    // Returns the style for a given feature
    const getStyle = (feature: any) => {
        let featureColor = "#808080";

        if (selectedWeatherField && feature.weather) {
            featureColor = getColor(feature.weather[selectedWeatherField.name]);
        }

        let mapFeatureNotHoveredStyle: MapFeatureStyle = {
            fillColor: featureColor,
            opacity: 1,
            fillOpacity: 0.8,
            ...layerNormalStyle
        };

        if (comparedFeatures.find((f:any) => f._id == feature._id)) {
            mapFeatureNotHoveredStyle = { 
                ...mapFeatureNotHoveredStyle, 
                ...layerHighlightedStyle 
            };
        }

        return mapFeatureNotHoveredStyle as PathOptions;
    }


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
        map.closePopup();
    }, [selectedWeatherField]);

    useEffect(() => {
        if (geoJSON) setLoading(false);
     }, [geoJSON])


    useEffect(() => {
        if (!hoveredFeature) return
        if (previousLayer && previousLayer.feature._id != hoveredFeature._id) previousLayer.closePopup();
        const layer = getLayer(hoveredFeature._id);
        const isOnComparisonList = existsInComparedFeatures(hoveredFeature._id);
        if (comparedFeatures.length > 1 && (hoveredFeature.rowHover || isOnComparisonList)) {
            setLayerStyle(layer, layerRedHighlightedStyle);
            //layer.setPopupContent(updatePopupContent(layer));
            //layer.openPopup();
            map.fitBounds(layer.getBounds(), {
                maxZoom: map.getZoom()
            });

        } 
        else setLayerStyle(layer, layerHighlightedStyle);
        setPreviousLayer(layer);
    }, [hoveredFeature])


    // Get layer by id
    const getLayer = (id: string) => {
        return props.geoJsonLayer.current.getLayer(id);
    }

    // Set layer style
    const setLayerStyle = (layer: any, style: MapFeatureStyle) => {
        if (!layer) return;
        sleep(10).then(_ => {
            layer.setStyle(style);
            layer.bringToFront();
        });
        return;
    }

    // Zooms to the feature clicked
    const zoomToFeature = (event: LeafletMouseEvent) => {
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

    const existsInComparedFeatures = (featureId: string) => {
        return comparedFeatures.find((feature: any) => feature._id === featureId);
    }

    const updatePopupContent = (layer: any) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <strong>${layer.feature.properties.Concelho}</strong><br>
            <span>${selectedWeatherField?.displayName}</span>
            <span>${selectedWeatherField && layer.feature.weather ? layer.feature.weather[selectedWeatherField.name] : ''} ${selectedWeatherField.unit}</span>
            <br/>
        `;

        const button = document.createElement("a");
        button.href = "#";

        if (comparisonMode) {
            const featureInComparison = existsInComparedFeatures(layer.feature._id);

            if (!featureInComparison) {
                button.innerHTML = "Adicionar à comparação";
                button.onclick = function() {
                    setComparedFeatures([...comparedFeatures, layer.feature]);
                    layer.closePopup();
                    highlightFeature(layer);
                    //event.target.setStyle(layerHighlightedStyle);
                }
            }
            else {
                button.innerHTML = "Remover da comparação";
                button.onclick = function() {
                    const filteredFeatures = comparedFeatures.filter((f:any) => f._id != layer.target.feature._id);
                    setComparedFeatures(filteredFeatures);
                    layer.closePopup();
                    setLayerStyle(layer, layerNormalStyle)
                }
            }
        }

        div.appendChild(button);
        return div;
    }

    // Sleep function 
    const sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Resets the highlight a feature of the map when hovered over.
    const resetHighlightFeature = (layer: any) => {
        if (layer.feature._id === clickedFeatureId) {
            return;
        }

        const exists = comparedFeatures.find((feature: any) => feature._id == layer.feature._id);
        if (exists) {
            setLayerStyle(layer, layerHighlightedStyle)
            return;
        }

        setLayerStyle(layer, layerNormalStyle);
    }

    // Highlights a feature of the map when hovered over.
    const highlightFeature = (layer: any) => {
        const isComparedFeature = comparedFeatures.find((f:any) => f._id == layer.feature._id);
        if (isComparedFeature && comparisonMode){
            setLayerStyle(layer, layerRedHighlightedStyle);
        }
        else setLayerStyle(layer, layerHighlightedStyle);
    }

    const setClickedFeatureId = (event: LeafletMouseEvent) => {
        if (!event.target) return;
        //setPreviousLayer(event.target);
        clickedFeatureId = event.target.feature._id;
        const feature = { 
            _id: event.target.feature._id, 
            properties: event.target.feature.properties,
            weather: event.target.feature.weather 
        };
        setFeatureProperties({_id: feature._id, weather: feature.weather, properties: feature.properties, mapHover: true });
        //setClickedFeature(feature);
        if (!comparisonMode && comparedFeatures.length <= 1) setComparedFeatures([feature]);
    }

    const clearFeature = (layer: CustomLayer) => {
        clickedFeatureId = null;
        if (comparisonMode) {
            const exists = existsInComparedFeatures(layer.feature._id);
            if (!exists) {
                setLayerStyle(layer, layerNormalStyle);
            } 
            setFeatureProperties({});
        }
    }

    const newSetClickedFeatureId = useStableCallback(setClickedFeatureId);
    const newResetHighlightFeature = useStableCallback(resetHighlightFeature);
    const newHighlightFeature = useStableCallback(highlightFeature);
    const newClearFeature = useStableCallback(clearFeature);
    const newUpdatePopupContent = useStableCallback(updatePopupContent);


    /**
     * The events associated with each feature
     */

    const onEachFeature = (feature: any, layer: CustomLayer, map: LeafletMap | null) => {
        layer.bindPopup(`<strong>${feature.properties.Concelho}</strong><br/>`);
        layer.getPopup()?.on('remove', () => {
            newClearFeature(layer);
        })

        layer.on({
            mouseover: () => {
                newHighlightFeature(layer);
            },
            mouseout: (event) => {
                newResetHighlightFeature(layer);
            },
            click: (event) => {
                newSetClickedFeatureId(event);
                layer.setPopupContent(newUpdatePopupContent(layer));
                newHighlightFeature(layer);
                //zoomToFeature(event, map);
                const row = document.getElementById("row_"+event.target.feature._id);  
                if (row) row.scrollIntoView(true); 
            },
        });

        layer._leaflet_id = feature._id;
    }

    return (
        <LayerGroup>
            <GeoJSON
                ref={props.geoJsonLayer}
                data={geoJSON as GeoJsonObject}
                onEachFeature={(feature, layer:CustomLayer) => onEachFeature(feature, layer, props.mapRef.current)}
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