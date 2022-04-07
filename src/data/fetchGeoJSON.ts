import {GeoJsonObject} from "geojson";

/**
 * Fetches and returns the geoJSON with only the border information.
 */
export async function fetchGeoJSON() {

    //! Fetch the geoJSON from the backend
    console.log("Started fetching the geoJSON from the backend.");
    let url = "http://localhost:8000/getRegionBorders/";

    const geoJSONsResponse = await fetch(url);

    console.log("Finished fetching the geoJSON from the backend.");

    // Note that despite the method being named json(),
    // the result is not JSON but is instead the result of taking JSON as input and parsing it to produce a JavaScript object.
    let geoJSON: GeoJsonObject = await geoJSONsResponse.json() as GeoJsonObject;

    return geoJSON;
}
