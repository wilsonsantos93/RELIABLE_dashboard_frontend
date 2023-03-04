import {GeoJsonObject} from "geojson";

/**
 * Fetches and returns the geoJSON with only the border information.
 */
export async function fetchWeatherGeoJSON(dateId: string) {
  /*   try {
        const timeout = 3000;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const url = `http://localhost:8000/api/map/getRegionBordersAndWeather?dateId=${dateId}`;

        const response = await fetch(url, {
            signal: controller.signal  
        });
        
        clearTimeout(id);

        return await response.json();
    } catch (e: any) {
        console.log('AbortError');
    }
 */
    //! Fetch the geoJSON from the backend
    console.log("Started fetching the weather geoJSON from the backend.");
    const url = `http://localhost:8000/api/map/getRegionBordersAndWeather?dateId=${dateId}`;

    const geoJSONsResponse = await fetch(url);

    console.log("Finished fetching the weather geoJSON from the backend.");

    // Note that despite the method being named json(),
    // the result is not JSON but is instead the result of taking JSON as input and parsing it to produce a JavaScript object.
    let geoJSON: any = await geoJSONsResponse.json();

    return geoJSON;
}
