import { useEffect, useRef, useState} from 'react';
import { GeoJSON, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoJsonObject} from "geojson";
import { GeoJSON as GJSON, Layer, LeafletMouseEvent, Map as LeafletMap, PathOptions } from "leaflet";
import "@mapbox/leaflet-pip";
import { useStableCallback } from '../../../hooks/UseStableCallback';
import UserMarker from '../user-marker/user-marker.component';
import "./geojson-layer.styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import ReactDOMServer from 'react-dom/server';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserIsLoggedIn, selectUserLocations } from '../../../store/user/user.selector';
import { addUserLocation } from '../../../store/user/user.action';
import { setGeoJsonLayer } from '../../../store/refs/refs.action';
import { selectSidebarRef } from '../../../store/refs/refs.selector';
import { selectIsSidebarOpen, selectRegionNamePath, selectSelectedDateId, selectSelectedWeatherField, selectWeatherFields } from '../../../store/settings/settings.selector';
import { selectComparedFeatures, selectNextLayer, selectSelectedFeature } from '../../../store/map/map.selector';
import { changeLoading } from '../../../store/settings/settings.action';
import { addFeatureToComparedFeatures, getGeoJsonData, removeFromComparedFeatures, selectFeature, updateComparedFeatures, updateNextLayer } from '../../../store/map/map.action';
import { getObjectValue } from '../../../utils/reducer/getObjectValue.utils';

type CustomLayer = { feature: any, _leaflet_id: string, markers: any[] } & Layer;

const layerHighlightedStyle = {
    color: "black",
    fillOpacity: 0.6,
    weight: 2
}

const layerRedHighlightedStyle = {
    ...layerHighlightedStyle,
    color: "red",
}

const layerNormalStyle = {
    color: "#a2a2a2",
    fillOpacity: 0.6,
    weight: 1
}

/* const layerNormalHoverStyle = {
    color: "#a2a2a2",
    fillOpacity: 0.5,
    weight: 2
} */

let clickedFeatureId: string | null = null;

// Sleep function 
const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const GeoJsonLayer = (props: any) => {
    const geoJsonLayerRef = useRef<GJSON>();
    const [geoJsonData, setGeoJsonData] = useState<GeoJsonObject | null>(null);
    const [previousLayer, setPreviousLayer] = useState<any>(null);

    const weatherFields = useSelector(selectWeatherFields);
    const selectedWeatherField = useSelector(selectSelectedWeatherField);
    const selectedDateId = useSelector(selectSelectedDateId);
    const sidebarRef = useSelector(selectSidebarRef);
    const isSidebarOpen = useSelector(selectIsSidebarOpen);
    const userMarkers = useSelector(selectUserLocations);
    const isLoggedIn = useSelector(selectUserIsLoggedIn);
    const comparedFeatures = useSelector(selectComparedFeatures);
    const selectedFeature = useSelector(selectSelectedFeature);
    const nextLayer = useSelector(selectNextLayer);
    const regionNamePath = useSelector(selectRegionNamePath);

    const dispatch = useDispatch<any>();

    useEffect(() => {
        dispatch(setGeoJsonLayer(geoJsonLayerRef));
    }, [geoJsonLayerRef])


    /* useEffect(() => {
        if (!geoJsonLayerRef || !geoJsonLayerRef.current || !userMarkers) return;

        const compFeatures = [...comparedFeatures];
        if (!userMarkers.length) {
            map.eachLayer((layer: any) => {
                layer.markers = [];
                const ix = compFeatures.findIndex((f:any) => f._id == layer._leaflet_id);
                if (ix >= 0) compFeatures[ix].markers = [];
            });
            //setComparedFeatures(compFeatures);
            dispatch(updateComparedFeatures(compFeatures));
            return;
        }

        const data: any = {};
        userMarkers.forEach((marker:any) => {
            const latlngPoint = new L.LatLng(marker.position.lat, marker.position.lng);
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

        //setComparedFeatures(compFeatures);
        dispatch(updateComparedFeatures(compFeatures));

    }, [userMarkers, geoJsonLayerRef]) */

    // Get color for depending on value
    const getColor = (value: number) => {
        const field = weatherFields.find((field:any) => field.name === selectedWeatherField?.name);
        if (field) {
            for (let r of field.ranges) {
                const min = r.min != null ? r.min : -Infinity; 
                const max = r.max != null ? r.max : Infinity;
                if (min <= value && value < max) return r.color
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

        let mapFeatureNotHoveredStyle = {
            ...layerNormalStyle,
            fillColor: featureColor,
            opacity: 1,
            fillOpacity: 0.6,
        };

        if (comparedFeatures.find((f:any) => f._id == feature._id)) {

            if (selectedFeature && selectedFeature._id == feature._id) {
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
            if (selectedDateId && regionNamePath) {
                dispatch(changeLoading(true));
                dispatch(getGeoJsonData(selectedDateId)).then((data: GeoJsonObject) => {
                    setGeoJsonData(data);
                    if (geoJsonLayerRef.current) {
                        geoJsonLayerRef.current.clearLayers().addData(data);
                        //update comparedFeatures
                        if (comparedFeatures.length) {
                            const updatedFeatures = []
                            for (const f of comparedFeatures) {
                                const layer = geoJsonLayerRef.current.getLayer(f._id) as CustomLayer;
                                if (!layer) continue;
                                const feature = { ...f, weather: layer?.feature?.weather }
                                updatedFeatures.push(feature);
                            }
                            if (updatedFeatures.length) dispatch(updateComparedFeatures(updatedFeatures));
                        }

                        if (nextLayer) {
                            const layer = geoJsonLayerRef.current.getLayer(nextLayer);
                            layer?.fire("click");
                            dispatch(updateNextLayer(null));
                        }
                    }
                    dispatch(changeLoading(false));
                }).catch(() => dispatch(changeLoading(false)));
            }
        })()
    }, [selectedDateId, regionNamePath]);

    useEffect(() => {
        if (!selectedFeature) return;
        const layer = getLayer(selectedFeature._id);
        layer?.setPopupContent(updatePopupContent(layer));
    }, [selectedWeatherField]);


    useEffect(() => {
        resetHighlightFeature(previousLayer);
        if (!selectedFeature) {
            clickedFeatureId = null;
            return;
        }

        const layer = getLayer(selectedFeature._id);

        highlightFeature(layer);
        setPreviousLayer(layer);
    }, [selectedFeature])


    // Get layer by id
    const getLayer = (id: any) => {
        return geoJsonLayerRef?.current?.getLayer(id);
    }

    // Set layer style
    const setLayerStyle = (layer: any, style: any) => {
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
        /* const filteredFeatures = comparedFeatures.filter((f:any) => f._id != layer.feature._id);
        setComparedFeatures(filteredFeatures); */
        dispatch(removeFromComparedFeatures(comparedFeatures, layer.feature._id));
    }

    const updatePopupContent = (layer: any, event?: any) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <div style="margin-bottom:2px">
                <strong>${getObjectValue(regionNamePath, layer.feature)}</strong><br>
                <span>${selectedWeatherField ? selectedWeatherField.displayName+':' : ''}</span>
                <span>${(selectedWeatherField && layer.feature.weather) && layer.feature.weather.hasOwnProperty(selectedWeatherField.name) ? layer.feature.weather[selectedWeatherField.name] : 'n/a'} ${selectedWeatherField ? selectedWeatherField.unit : ''}</span>
            </div>
        `;

        // add marker button
        if (isLoggedIn) {
            const markerBtn = document.createElement("button");
            markerBtn.className = "btn btn-sm btn-outline-primary";
            markerBtn.title = "Adicionar marcador";
            markerBtn.innerHTML = ReactDOMServer.renderToStaticMarkup(<FontAwesomeIcon icon={faLocationDot} />);
            markerBtn.onclick = function() {
                //addUserMarker(event.latlng);
                dispatch(addUserLocation(userMarkers, { ...event.latlng }));
                layer.closePopup();
            }
            div.appendChild(markerBtn);
        }


        // Remove button
        const removeBtn = document.createElement("button");
        removeBtn.className = "btn btn-sm btn-outline-danger";
        removeBtn.title = "Remover da lista";
        //removeBtn.innerHTML = "Remover da lista";
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
        if (layer.getPopup().isOpen()) layer.closeTooltip();
        layer.setTooltipContent(getObjectValue(regionNamePath, layer.feature))
        const isComparedFeature = existsInComparedFeatures(layer.feature._id);
        if (isComparedFeature){
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
        
        const obj = { _id, weather, properties, markers: event.target.markers, marker: event.marker || {_id: null}, markerRef: event.markerRef };
        dispatch(selectFeature(obj));

        const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

        // Scroll table
        const tblSelector = ".featuresTable .p-datatable-wrapper" //".featureTable > div"
        const table = document.querySelector(tblSelector);

        if (!existsInComparedFeatures(_id) && feature.weather) {
            dispatch(addFeatureToComparedFeatures(comparedFeatures, feature));
        }
        
        sleep(10).then(() => {
            const elSelector = `tr.row-${event.target.feature._id}` //`div#row-${event.target.feature._id}`
            const el = document.querySelector(elSelector);
            if (el) {
                const offset = 120 //35;
                const topPos = (el as HTMLElement).offsetTop;
                if (table) table.scrollTop = topPos - offset;
            }
        })

        if (sidebarRef?.current && !isSidebarOpen && !window.mobileCheck()) {
            sidebarRef.current.open("tab1");
        }

        /* const offset = map.getSize().x * 0.25;
        const coordinates = layer.getPopup()?.getLatLng();
        if (coordinates) {
            map.panTo(coordinates, {animate: false})//.panBy(new L.Point(offset, 0), {animate: false});
        } */
    }

    // Clear the layer
    const clearFeature = () => {
        dispatch(selectFeature(null));
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
        layer.bindPopup(`<strong>${getObjectValue(regionNamePath, feature)}</strong><br/>`);
        
        layer.getPopup()?.on('remove', () => {   
            newClearFeature();
        })

        if (!window.mobileCheck()) layer.bindTooltip(getObjectValue(regionNamePath, feature))

        layer.on({
            mouseover: () => {
                newHighlightFeature(layer);
            },
            mouseout: () => {
                newResetHighlightFeature(layer);
            },
            click: (event) => {
                newSetClickedFeatureId(event as LeafletMouseEvent & {marker: any, markerRef: any; }, layer);
                layer.setPopupContent(newUpdatePopupContent(layer, event));
                layer.closeTooltip();
                setLayerStyle(layer, layerRedHighlightedStyle);
               
                const e = event as any;
                  
                if (!e.markerRef) layer.openPopup(e.latlng);
                else e.markerRef.openPopup();
            },
        });

        layer._leaflet_id = feature._id;
        layer.markers = [];
    }

    return (
        <LayerGroup>
            <GeoJSON
                ref={geoJsonLayerRef}
                data={geoJsonData as GeoJsonObject}
                onEachFeature={(feature, layer:CustomLayer) => onEachFeature(feature, layer, props.mapRef.current)}
                // @ts-ignore
                style={getStyle}
            />

            {   
                (isLoggedIn && userMarkers.length) ?
                userMarkers.map((marker: any) =>
                    <UserMarker key={marker._id} data={marker} />
                )
                : null
            }
        </LayerGroup>
    );
}

export default GeoJsonLayer;