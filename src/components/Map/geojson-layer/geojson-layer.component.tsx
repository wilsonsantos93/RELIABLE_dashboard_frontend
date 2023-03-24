import { useEffect, useMemo, useRef, useState} from 'react';
import { GeoJSON, LayerGroup, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { popup } from 'leaflet';
import { GeoJsonObject} from "geojson";
import { GeoJSON as GJSON, LatLng, Layer, LeafletMouseEvent, Map as LeafletMap, PathOptions } from "leaflet";
import {MapFeatureStyle} from "../../../types/MapFeatureStyle";
import WeatherPanelStore from "../../../stores/WeatherPanelStore";
import HoveredFeatureStore from "../../../stores/HoveredFeatureStore";
import {fetchWeatherGeoJSON} from "../../../data/fetchWeatherGeoJSON";
import "@mapbox/leaflet-pip";
import { useStableCallback } from '../../../hooks/UseStableCallback';
import UserMarker from '../user-marker/user-marker.component';
import UserMarkerStore from '../../../stores/UserMarkerStore';
import "./geojson-layer.styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faLocationDot, faTrash } from '@fortawesome/free-solid-svg-icons';
import ReactDOMServer from 'react-dom/server';
import { EndOfLineState } from 'typescript';
declare function require(name:string):any;
const leafletPip = require('@mapbox/leaflet-pip');

type CustomLayer = { addedToList: boolean, feature: any, _leaflet_id: string, markers: any[] } & Layer;

const layerHighlightedStyle: MapFeatureStyle = {
    color: "black",
    fillOpacity: 0.5,
    weight: 2
}

const layerRedHighlightedStyle: MapFeatureStyle = {
    ...layerHighlightedStyle,
    color: "red",
}

const layerNormalStyle: MapFeatureStyle = {
    color: "#a2a2a2",
    fillOpacity: 0.5,
    weight: 1
}

const layerNormalHoverStyle: MapFeatureStyle = {
    color: "#a2a2a2",
    fillOpacity: 0.5,
    weight: 2
}

let clickedFeatureId: string | null = null;

// Sleep function 
const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

    //const comparisonMode = WeatherPanelStore(state => state.comparisonMode);

    const setLoading = WeatherPanelStore(state => state.setLoading);

    //const selectMode = WeatherPanelStore(state => state.selectMode);

    const geoJsonLayerRef = useRef<GJSON>();

    const setGeoJsonLayerRef = WeatherPanelStore(state => state.setGeoJsonLayerRef);

    const userMarkers = UserMarkerStore(state => state.userMarkers);
    const addUserMarker = UserMarkerStore(state => state.addUserMarker);

    const sidebar = WeatherPanelStore(state => state.sidebar);
    const isTabOpen = WeatherPanelStore(state => state.isTabOpen);

    useEffect(() => {
        setGeoJsonLayerRef(geoJsonLayerRef);
/*         const popupCloseBtn = document.querySelector("a.leaflet-popup-close-button");
        if (popupCloseBtn) popupCloseBtn?.addEventListener("click", () => {
            console.log("Fechou popup");
        }); */

    }, [geoJsonLayerRef])

    const map = useMap();

    useEffect(() => {
        if (!geoJsonLayerRef || !geoJsonLayerRef.current) return;

        const compFeatures = [...comparedFeatures];
        if (!userMarkers.length) {
            map.eachLayer((layer: any) => {
                layer.markers = [];
                const ix = compFeatures.findIndex((f:any) => f._id == layer._leaflet_id);
                if (ix >= 0) compFeatures[ix].markers = layer.markers;
            });
            setComparedFeatures(compFeatures);
            return;
        }

        const data: any = {};
        userMarkers.forEach(marker => {
            const latlngPoint = new L.LatLng(marker.lat, marker.lng);
            const results = leafletPip.pointInLayer(latlngPoint, geoJsonLayerRef.current, true);
            results.forEach((layer: any) => {
                if (!data.hasOwnProperty(layer.feature._id)) data[layer.feature._id] = [];
                data[layer.feature._id].push(marker);
            });
        })

        for (let key in data) {
            const layer: any = geoJsonLayerRef.current.getLayer(key as any);
            if (layer) layer.markers = data[key];
            const ix = compFeatures.findIndex((f:any) => f._id == layer.feature._id);
            if (ix >= 0) { 
                compFeatures[ix].markers = layer.markers;
            }
        }

        setComparedFeatures(compFeatures);

    }, [userMarkers, geoJsonLayerRef, geoJSON])

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
            fillOpacity: 0.5,
            ...layerNormalStyle
        };

        if (comparedFeatures.find((f:any) => f._id == feature._id)) {

            if (hoveredFeature && hoveredFeature._id == feature._id) {
                mapFeatureNotHoveredStyle = { 
                    ...mapFeatureNotHoveredStyle, 
                    ...layerRedHighlightedStyle 
                };
            } else {
                mapFeatureNotHoveredStyle = { 
                    ...mapFeatureNotHoveredStyle, 
                    ...layerHighlightedStyle 
                };
            }
        }

        return mapFeatureNotHoveredStyle as PathOptions;
    }

    useEffect(() => {
        (async () => {
            if (selectedDateId) {
                setLoading(true);
                const data = await fetchWeatherGeoJSON(selectedDateId);
                setGeoJSON(data);
                if (geoJsonLayerRef.current) {
                    geoJsonLayerRef.current.clearLayers().addData(data);
                }
            }
        })()
    }, [selectedDateId]);

    useEffect(() => {
        if (!hoveredFeature) return;
        const layer = getLayer(hoveredFeature._id);
        layer?.setPopupContent(updatePopupContent(layer));
    }, [selectedWeatherField]);

    useEffect(() => {
        if (geoJSON) setLoading(false);
     }, [geoJSON])


    useEffect(() => {
        resetHighlightFeature(previousLayer);
        if (!hoveredFeature) {
            clickedFeatureId = null;
            return;
        }

        //if (previousLayer && previousLayer.feature._id != hoveredFeature._id) previousLayer.closePopup();
        const layer = getLayer(hoveredFeature._id);
        //const isOnComparisonList = existsInComparedFeatures(hoveredFeature._id);
    
        //if (comparedFeatures.length > 1 && (hoveredFeature.rowHover || isOnComparisonList)) {
        /* if (isOnComparisonList) {
            map.fitBounds(layer.getBounds(), {
                maxZoom: map.getZoom()
            });
            console.log("useEffect hoveredFeature - Setting RED color");
            setLayerStyle(layer, layerRedHighlightedStyle);
        } 
        else {
            console.log("useEffect hoveredFeature - Setting BLACK color");
            setLayerStyle(layer, layerHighlightedStyle);
        }  */
        highlightFeature(layer);
        setPreviousLayer(layer);
    }, [hoveredFeature])


    // Get layer by id
    const getLayer = (id: any) => {
        return geoJsonLayerRef?.current?.getLayer(id);
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
    /* const zoomToFeature = (event: LeafletMouseEvent) => {
        if (map !== null) {
            //map.fitBounds(event.target.getBounds());
            const currentZoom = map.getZoom();
            let zoom = 9;
            if (currentZoom >= zoom) {
                zoom = currentZoom;
            }
            map.setView(event.latlng, zoom);
        }
    } */

    const existsInComparedFeatures = (featureId: string) => {
        return comparedFeatures.find((f: any) => f._id === featureId);
    }

    const removeFeatureFromList = (layer: CustomLayer) => {
        const filteredFeatures = comparedFeatures.filter((f:any) => f._id != layer.feature._id);
        setComparedFeatures(filteredFeatures);
    }

    const updatePopupContent = (layer: any, event?: any) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <div style="margin-bottom:2px">
                <strong>${layer.feature.properties.Concelho}</strong><br>
                <span>${selectedWeatherField?.displayName}:</span>
                <span>${selectedWeatherField && layer.feature.weather ? layer.feature.weather[selectedWeatherField.name] : ''} ${selectedWeatherField.unit}</span>
            </div>
        `;

        // marker button
        const markerBtn = document.createElement("button");
        markerBtn.className = "btn btn-sm btn-outline-primary";
        markerBtn.title = "Adicionar marcador";
        markerBtn.innerHTML = ReactDOMServer.renderToStaticMarkup(<FontAwesomeIcon icon={faLocationDot} />);
        markerBtn.onclick = function() {
            addUserMarker(event.latlng);
            layer.closePopup();
        }
        div.appendChild(markerBtn);


        // Remove button
        const removeBtn = document.createElement("button");
        removeBtn.className = "btn btn-sm btn-outline-danger";
        removeBtn.title = "Remover da lista";
        removeBtn.innerHTML = ReactDOMServer.renderToStaticMarkup(<FontAwesomeIcon icon={faEyeSlash} />);
        removeBtn.onclick = function() {
            newRemoveFeatureFromList(layer);
            layer.closePopup();
            setLayerStyle(layer, layerNormalStyle)
        }
        div.appendChild(removeBtn);


        // Remove link
        const button = document.createElement("a");
        button.href = "#";

        //const featureInComparison = existsInComparedFeatures(layer.feature._id);
        //if (featureInComparison) {
            button.innerHTML = "Remover da lista";
            button.onclick = function() {
                newRemoveFeatureFromList(layer);
                //layer.closePopup();
                setLayerStyle(layer, layerNormalStyle)
            }
       // }

        /* if (comparisonMode) {
            const featureInComparison = existsInComparedFeatures(layer.feature._id);

            if (!featureInComparison) {
                button.innerHTML = "Adicionar à lista";
                button.onclick = function() {
                    setComparedFeatures([...comparedFeatures, layer.feature]);
                    layer.closePopup();
                    newHighlightFeature(layer);
                    const tbl = document.querySelector(".featuresTable");
                    if (tbl) tbl.scrollIntoView({block: "end", inline: "end"});
                }
            }
            else {
                button.innerHTML = "Remover da lista";
                button.onclick = function() {
                    const filteredFeatures = comparedFeatures.filter((f:any) => f._id != layer.feature._id);
                    setComparedFeatures(filteredFeatures);
                    layer.closePopup();
                    setLayerStyle(layer, layerNormalStyle)
                }
            }
        }  */

        //div.appendChild(button);
        return div;
    }


    // Resets the highlight a feature of the map when hovered out.
    const resetHighlightFeature = (layer: any) => {
        if (!layer || (layer.feature._id === clickedFeatureId)) {
            return;
        }

        const exists = existsInComparedFeatures(layer.feature._id);
        if (exists) {
            setLayerStyle(layer, layerHighlightedStyle)
        }

        else setLayerStyle(layer, layerNormalStyle);
    }

    // Highlights a feature of the map when hovered over.
    const highlightFeature = (layer: any) => {
        if (!layer) return;
        const isComparedFeature = existsInComparedFeatures(layer.feature._id);
        if (isComparedFeature/*  && comparisonMode */){
            setLayerStyle(layer, layerRedHighlightedStyle);
        }
        else {
            setLayerStyle(layer, layerHighlightedStyle);
        }
    }

    // Set clicked feature id
    const setClickedFeatureId = (event: LeafletMouseEvent & {marker: any, markerRef: any}, layer: any) => {
        if (!event.target) {
            return;
        }
    
        let feature = { ...event.target.feature, markers: event.target.markers, marker: event.marker || { _id: null }, markerRef: event.markerRef };
        clickedFeatureId = feature._id;

        const { _id, weather, properties } = feature;

        /* if ((previousLayer && previousLayer.feature._id !== _id) || !previousLayer) {
            setFeatureProperties({ _id, weather, properties, markers: event.target.markers, marker: event.marker || {_id: null}, markerRef: event.markerRef });
        } */

        setFeatureProperties({ _id, weather, properties, markers: event.target.markers, marker: event.marker || {_id: null}, markerRef: event.markerRef });

        if (!existsInComparedFeatures(_id)) {
            setComparedFeatures([feature, ...comparedFeatures]);
        }

        if (sidebar && !isTabOpen && !window.mobileCheck()) {
            sidebar.open("tab1");
        }

        /* const offset = map.getSize().x * 0.25;
        const coordinates = layer.getPopup()?.getLatLng();
        if (coordinates) {
            map.panTo(coordinates, {animate: false})//.panBy(new L.Point(offset, 0), {animate: false});
        } */


        //if (!existsInComparedFeatures(_id)) setComparedFeatures([feature, ...comparedFeatures])
        //if (!comparisonMode && comparedFeatures.length <= 1) setComparedFeatures([feature]);
    }

    // Clear the layer
    const clearFeature = () => {
        setFeatureProperties(null);

        /* if (comparisonMode) {
            const exists = existsInComparedFeatures(layer.feature._id);
            if (!exists) {
                console.log("clearFeature - Setting NORMAL style.");
                setLayerStyle(layer, layerNormalStyle);
                setFeatureProperties({});
                clickedFeatureId = null;
            } else {
                console.log("clearFeature - exists");
                setLayerStyle(layer, layerHighlightedStyle);
            }
        } */
    }


    const newSetClickedFeatureId = useStableCallback(setClickedFeatureId);
    const newResetHighlightFeature = useStableCallback(resetHighlightFeature);
    const newHighlightFeature = useStableCallback(highlightFeature);
    const newClearFeature = useStableCallback(clearFeature);
    const newUpdatePopupContent = useStableCallback(updatePopupContent);
    const newRemoveFeatureFromList = useStableCallback(removeFeatureFromList);


    /**
     * The events associated with each feature
     */
    const onEachFeature = (feature: any, layer: CustomLayer, map: LeafletMap | null) => {
        layer.bindPopup(`<strong>${feature.properties.Concelho}</strong><br/>`);
        
        layer.getPopup()?.on('remove', (e) => {   
            newClearFeature();
        })

        /* layer.getPopup()?.on('add', (e) => {   
            const popupCloseBtn = document.querySelector(".leaflet-popup-close-button")
            if (popupCloseBtn) popupCloseBtn.addEventListener("click", () => {
                newClearFeature();
            })
        }) */

        //layer.off('click');

        layer.on({
            mouseover: () => {
                newHighlightFeature(layer);
            },
            mouseout: (event) => {
                newResetHighlightFeature(layer);
            },
            click: (event) => {
                newSetClickedFeatureId(event as LeafletMouseEvent & {marker: any, markerRef: any; }, layer);
                layer.setPopupContent(newUpdatePopupContent(layer, event));
                setLayerStyle(layer, layerRedHighlightedStyle);
               
                const e = event as any;
                  
                if (!e.marker) layer.openPopup(e.latlng);
                else {
                    e.markerRef.openPopup();
                }

                const el = document.querySelector(`div#row-${event.target.feature._id}`);
                const table = document.querySelector(".featuresTable > div");
                if (el && table) {
                    const topPos = (el as HTMLElement).offsetTop;
                    table.scrollTop = topPos - 35;

                }
               
                //setMarkerPosition(event.latlng);
                //zoomToFeature(event);
                /* const row = document.getElementById("row_"+event.target.feature._id);  
                if (row) row.scrollIntoView(true);  */
            },
        });

        layer._leaflet_id = feature._id;
        layer.markers = [];
    }

    return (
        <LayerGroup>
            <GeoJSON
                ref={geoJsonLayerRef}
                data={geoJSON as GeoJsonObject}
                onEachFeature={(feature, layer:CustomLayer) => onEachFeature(feature, layer, props.mapRef.current)}
                // @ts-ignore
                style={getStyle}
            />

            {   userMarkers && userMarkers.map((marker) =>
                    <UserMarker key={marker._id} data={marker} />
                )
            }
        </LayerGroup>
    );
}

export default GeoJsonLayer;