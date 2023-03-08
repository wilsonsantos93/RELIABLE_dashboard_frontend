import '../../styles/MapFeatureInformation.css'
import HoveredFeatureStore from "../../stores/HoveredFeatureStore";
import { FeatureProperties } from '../../types/FeatureProperties';
import WeatherPanelStore from '../../stores/WeatherPanelStore';

function HoveredFeaturePanel(): JSX.Element {

    const featureProperties = HoveredFeatureStore(state => state.featureProperties);
    const weatherFields = WeatherPanelStore(state => state.weatherFields);

    // Classes used by Leaflet to position controls
    const POSITION_CLASSES = {
        bottomleft: 'leaflet-bottom leaflet-left',
        bottomright: 'leaflet-bottom leaflet-right',
        topleft: 'leaflet-top leaflet-left',
        topright: 'leaflet-top leaflet-right',
    }

    let freguesia: JSX.Element = <div/>;
    if (featureProperties?.Freguesia) {
        freguesia = <div style={{fontSize: 20}}>
            {/* Freguesia: {featureProperties?.Freguesia} <br/> */}
            Freguesia: { featureProperties.properties.Freguesia } <br/>
        </div>
    }

    let concelho: JSX.Element = <div/>;
    if (featureProperties?.properties) {
        freguesia = <div style={{fontSize: 20}}>
            {/* Concelho: {featureProperties?.Concelho} <br/> */}
            Concelho: { featureProperties.properties.Concelho } <br/>
        </div>
    }

    let pais: JSX.Element = <div/>;
    if (featureProperties?.sovereignt) {
        pais = <div style={{fontSize: 20}}>
            País: {featureProperties?.sovereignt} <br/>
        </div>
    }

/*     let temperature: JSX.Element = <div/>;
    if (featureProperties?.weather) {
        temperature = <div style={{fontSize: 20}}>
            Temperatura (C): {featureProperties?.weather?.current?.temp_c} <br/>
        </div>
    }

    let windSpeed: JSX.Element = <div/>;
    if (featureProperties?.weather) {
        // @ts-ignore
        windSpeed =
            <div style={{fontSize: 20}}>
                Velocidade do vento (Kph): {featureProperties?.weather?.current?.wind_kph} <br/>
            </div>
    } */



    return (
        <div className={POSITION_CLASSES["bottomleft"]}>
            <div className="leaflet-control leaflet-bar MapFeatureInformation">
                <h4>Weather information</h4>
                {freguesia}
                {concelho}
                {pais}
                {/* {temperature}
                {windSpeed} */}
            </div>
        </div>
    )

}

export default HoveredFeaturePanel;

