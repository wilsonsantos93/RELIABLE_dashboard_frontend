import {FeatureProperties} from "./Feature/FeatureProperties";
import {FeatureGeometryPolygon} from "./Feature/FeatureGeometry/FeatureGeometryPolygon";
import {FeatureWeather} from "./Feature/FeatureWeather";

export interface Feature {
    type: "Feature";
    properties: FeatureProperties;
    geometry: FeatureGeometryPolygon;
    weather?: FeatureWeather;
}