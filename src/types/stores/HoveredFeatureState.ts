import {FeatureProperties} from "../FeatureProperties";

export interface HoveredFeatureState {
    featureProperties: any; //FeatureProperties | null
    setFeatureProperties: (obj: any) => void //(featureProperties: FeatureProperties | null) => void
}
