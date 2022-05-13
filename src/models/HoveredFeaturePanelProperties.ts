import {Feature, Polygon} from "geojson";
import {FeatureProperties} from "./FeatureProperties";

export interface HoveredFeaturePanelProperties {
    hoveredFeatureProperties:  FeatureProperties | null;
}