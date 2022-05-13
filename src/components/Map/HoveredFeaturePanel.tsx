import React from 'react';
import '../../styles/MapFeatureInformation.css'
import HoveredFeatureStore from "../../stores/HoveredFeatureStore";

function HoveredFeaturePanel(): JSX.Element {

    const featureProperties = HoveredFeatureStore(state => state.featureProperties)

    // Classes used by Leaflet to position controls
    const POSITION_CLASSES = {
        bottomleft: 'leaflet-bottom leaflet-left',
        bottomright: 'leaflet-bottom leaflet-right',
        topleft: 'leaflet-top leaflet-left',
        topright: 'leaflet-top leaflet-right',
    }


    return (
        <div className={POSITION_CLASSES["topright"]}>
            <div className="leaflet-control leaflet-bar MapFeatureInformation">
                <h4>Weather information</h4>
                {featureProperties?.sovereignt}
            </div>
        </div>
    )

}

export default HoveredFeaturePanel;

