import {RefObject} from "react";
import {Map as LeafletMap} from "leaflet";

export interface GeoJsonLayerProperties {
    mapRef:  RefObject<LeafletMap>
}