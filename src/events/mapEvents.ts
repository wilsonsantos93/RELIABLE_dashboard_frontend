import {GeoJSON as geoJSONLayer, Layer, LeafletMouseEvent, Map as LeafletMap} from "leaflet";
import {Feature, Geometry, Polygon} from "geojson";


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

    mapFeatureHoveredEvent.setStyle({
        weight: 5,
        // color: "#666",
        dashArray: "",
        fillOpacity: 0.7,
    });

    // mapFeatureHoveredEvent.bringToFront();

    if ("weather" in mapFeatureHovered) {
        updateInformationMenuWithWeather(mapFeatureHovered, mapInformationMenu);
    } else if (!("weather" in mapFeatureHovered)) {
        updateInformationMenuWithName(mapFeatureHovered, mapInformationMenu);
    }
}

// Stops highlighting a feature when it stops being hovered over
function resetHighlight(event: LeafletMouseEvent, mapInformationMenu: HTMLElement, geoJSONLayer: geoJSONLayer) {

    console.log("Reset highlighted feature.")
    console.log(event.target)
    console.log(mapInformationMenu)
    console.log(geoJSONLayer)
    console.log("Finished reset highlighted feature.")

    let mapFeatureCurrentlyHovered = event.target;
    geoJSONLayer.resetStyle(mapFeatureCurrentlyHovered);

    if ("weather" in mapFeatureCurrentlyHovered) {
        updateInformationMenuWithWeather(mapFeatureCurrentlyHovered, mapInformationMenu);
    } else if (!("weather" in mapFeatureCurrentlyHovered)) {
        updateInformationMenuWithName(mapFeatureCurrentlyHovered, mapInformationMenu);
    }
}

// Zooms to the feature clicked
function zoomToFeature(event: LeafletMouseEvent, worldMap: LeafletMap) {
    worldMap.fitBounds(event.target.getBounds());
}

/**
 * The events associated with each feature
 */
export function onEachFeature(feature: Feature<Geometry, any>, layer: Layer) {
    layer.on({
        // @ts-ignore
        mouseover: highlightFeature,
        // @ts-ignore
        mouseout: (event) => {resetHighlight(layer)},
        // @ts-ignore
        click: zoomToFeature,
    });
}

