/**
 * Fetches and returns the weather fields from metadata collection
 */
export async function fetchWeatherFields() {
    console.log("Started fetching weather fields from the backend.");
    let url = "http://localhost:8000/api/weather/metadata";

    const response = await fetch(url);

    console.log("Finished fetching weather fields from the backend.");

    // Note that despite the method being named json(),
    // the result is not JSON but is instead the result of taking JSON as input and parsing it to produce a JavaScript object.
    const data: any = await response.json();

    return data;
}
