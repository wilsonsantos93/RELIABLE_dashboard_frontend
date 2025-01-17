const base_url = process.env.REACT_APP_API_BASE_URL;

/**
 * Fetches and returns the geoJSON with only the border information.
 */
export async function fetchGeoJSON() {

    //! Fetch the geoJSON from the backend
    console.log("Started fetching the geoJSON from the backend.");
    let url = `${base_url}/api/region`;

    const geoJSONsResponse = await fetch(url);

    console.log("Finished fetching the geoJSON from the backend.");

    // Note that despite the method being named json(),
    // the result is not JSON but is instead the result of taking JSON as input and parsing it to produce a JavaScript object.
    let geoJSON: any  = await geoJSONsResponse.json();

    return geoJSON;
}