import React from 'react';
import '../styles/MapFeatureInformation.css'
import {MapFeatureInformationProperties} from "../models/MapFeatureInformationProperties";

function MapFeatureInformation(props: MapFeatureInformationProperties): JSX.Element {

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
                {props.mapFeatureInformation}
            </div>
        </div>
    )

}

export default MapFeatureInformation;

