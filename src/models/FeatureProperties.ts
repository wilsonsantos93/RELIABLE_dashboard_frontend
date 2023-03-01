/**
 * {@link https://www.weatherapi.com/docs} realtime API results
 */
interface FeatureWeather {
    last_updated: string //	Local time when the real time data was updated.
    last_updated_epoch: number // Local time when the real time data was updated in unix time.
    temp_c: number // Temperature in celsius
    temp_f: number	// Temperature in fahrenheit
    feelslike_c: number // Feels like temperature in celsius
    feelslike_f: number // Feels like temperature in fahrenheit
    "condition:text": string // Weather condition text
    "condition:icon": string // Weather icon url
    "condition:code": number //	Weather condition unique code.
    wind_mph: number// Wind speed in miles per hour
    wind_kph: number // Wind speed in kilometer per hour
    wind_degree: number	// Wind direction in degrees
    wind_dir: string	// Wind direction as 16 point compass. e.g.: NSW
    pressure_mb: number // Pressure in millibars
    pressure_in: number // Pressure in inches
    precip_mm: number // Precipitation amount in millimeters
    precip_in: number // Precipitation amount in inches
    humidity: number // Humidity as percentage
    cloud: number // Cloud cover as percentage
    is_day: number // 1 = Yes 0 = No Whether to show day condition icon or night icon
    uv: number // UV Index
    gust_mph: number // Wind gust in miles per hour
    gust_kph: number // Wind gust in kilometer per hour
}

export interface FeatureProperties {
    Freguesia?: string
    sovereignt?: string
    weather?: FeatureWeather
    Concelho?: string
}