import {Feature} from "./GeoJSON/Feature";
import {CoordinatesReferenceSystem} from "./GeoJSON/CoordinatesReferenceSystem";

export interface GeoJSON {
    readonly type?: "FeatureCollection";
    readonly crs?: CoordinatesReferenceSystem;
    readonly features: Feature[];
}
