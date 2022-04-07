import {GeoJSON as GeoJSONLayer, Layer, LeafletMouseEvent, Map as LeafletMap} from "leaflet";
import {Feature, Geometry, Polygon} from "geojson";
import React, {Dispatch} from "react";
import {MapFeatureStyle} from "../styles/MapFeatureStyle";


// TODO: Make the geoJSON property field name more dynamic
/**
 * Update the information menu with the weather based on feature properties passed.
 * @param mapFeatureCurrentlyHovered The geoJSON feature that is currently hovered over.
 * @param mapInformationMenu The menu with the weather information.
 */
function updateInformationMenuWithName(mapFeatureCurrentlyHovered: Feature<Polygon, { "Freguesia": string }>, mapInformationMenu: HTMLElement) {

    if (mapFeatureCurrentlyHovered.properties) {
        mapInformationMenu.innerHTML =
            "<h4>Weather</h4>" +
            (mapFeatureCurrentlyHovered
                ? "<b>" +
                mapFeatureCurrentlyHovered.properties.Freguesia +
                "</b><br />"
                : "Hover over a state");
    }


}

// TODO: Make the geoJSON property field name more dynamic
/**
 * Update the information menu based with the weather information on feature properties passed.
 * @param mapFeatureCurrentlyHovered The geoJSON feature that is currently hovered over.
 * @param mapInformationMenu The menu with the weather information.
 */
function updateInformationMenuWithWeather(mapFeatureCurrentlyHovered: Feature<Polygon, { "weather": any, "Freguesia": string }>, mapInformationMenu: HTMLElement) {

    mapInformationMenu.innerHTML =
        "<h4>Weather</h4>" +
        (mapFeatureCurrentlyHovered
            ? "<b>" +
            mapFeatureCurrentlyHovered.properties.Freguesia +
            "</b><br />" +
            mapFeatureCurrentlyHovered.properties.weather.current.temp_c +
            " degrees Celsius" +
            "</b><br />" +
            mapFeatureCurrentlyHovered.properties.weather.current.last_updated +
            " last updated"
            : "Hover over a state")

}


/**
 * Highlights a feature of the map when hovered over
 * @param event The event when a feature is hovered over.
 * @param mapInformationMenu The menu with the weather information.
 */
function highlightFeature(event: LeafletMouseEvent, mapInformationMenu: HTMLElement) {
    let mapFeatureHoveredEvent = event.target;
    let mapFeatureHovered = mapFeatureHoveredEvent.feature;

    let mapFeatureHoveredStyle: MapFeatureStyle = {
        weight: 5,
        dashArray: "",
    }
    mapFeatureHoveredEvent.setStyle(mapFeatureHoveredStyle);
    mapFeatureHoveredEvent.bringToFront();

    if ("weather" in mapFeatureHovered) {
        updateInformationMenuWithWeather(mapFeatureHovered, mapInformationMenu);
    } else if (!("weather" in mapFeatureHovered)) {
        updateInformationMenuWithName(mapFeatureHovered, mapInformationMenu);
    }
}

// Stops highlighting a feature when it stops being hovered over
function resetHighlight(event: LeafletMouseEvent, layer: Layer, setMapFeatureInformation: Dispatch<React.SetStateAction<string>> ) {

    console.log("Reset highlighted feature.")
    console.log(event.target)
    console.log(layer)
    console.log("Finished reset highlighted feature.")

    let mapFeatureCurrentlyHovered = event.target;
    let mapFeatureNotHoveredStyle: MapFeatureStyle = {
        weight: 2,
        dashArray: "3",
    };
    mapFeatureCurrentlyHovered.setStyle(mapFeatureNotHoveredStyle);

}

// Zooms to the feature clicked
function zoomToFeature(event: LeafletMouseEvent, worldMap: LeafletMap) {
    worldMap.fitBounds(event.target.getBounds());
}

/**
 * The events associated with each feature
 */
export function onEachFeature(feature: Feature<Geometry, any>, layer: Layer, setMapFeatureInformation: Dispatch<React.SetStateAction<string>>) {

    // console.log("Feature begin")
    // console.log(feature)
    // console.log(layer)
    // console.log("Feature end")

    layer.on({
        // @ts-ignore
        mouseover: (event) => {highlightFeature(event, layer, setMapFeatureInformation)},
        // @ts-ignore
        mouseout: (event) => {resetHighlight(event, layer, setMapFeatureInformation)},
        // @ts-ignore
        click: zoomToFeature,
    });
}

