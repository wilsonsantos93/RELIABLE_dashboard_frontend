/**
 * Fetches and returns the geoJSON with the weather dates informatio .
 */
export async function fetchWeatherDates() {

    console.log("Started fetching the weather dates from the backend.");
    let url = "http://localhost:8000/api/weather/dates";

    const weatherDatesResponse = await fetch(url);

    console.log("Finished fetching the weather dates from the backend.");

    // Note that despite the method being named json(),
    // the result is not JSON but is instead the result of taking JSON as input and parsing it to produce a JavaScript object.
    let weatherDatesAsString = await weatherDatesResponse.json() as { date: string, _id: string }[];
    let weatherDatesAsDate = []
    for (const currentWeatherDateAsString of weatherDatesAsString) {
        weatherDatesAsDate.push({ date: new Date(currentWeatherDateAsString.date), _id: currentWeatherDateAsString._id })
    }
    return weatherDatesAsDate;
}
