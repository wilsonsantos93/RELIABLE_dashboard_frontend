import React, {RefObject} from "react";
import {GeoJSON, Map as LeafletMap} from "leaflet";

export interface GeoJsonLayerProperties {
    mapRef:  RefObject<LeafletMap>
    geoJsonLayer: React.RefObject<GeoJSON<any>>
}