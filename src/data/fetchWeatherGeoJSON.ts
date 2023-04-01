const base_url = process.env.REACT_APP_API_BASE_URL;
/**
 * Fetches and returns the geoJSON with only the border information.
 */
export async function fetchWeatherGeoJSON(dateId: string) {
    try {
        const timeout = 20000;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const url = `${base_url}/api/map/getRegionBordersAndWeather?dateId=${dateId}`;

        const response = await fetch(url, {
            signal: controller.signal  
        });
        
        clearTimeout(id);

        if (!response.ok) throw "";

        const data = await response.json();

        return data;
    } catch (e: any) {
        throw "Não foi possível obter os dados.";
    }
}
