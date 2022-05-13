import {FeatureProperties} from "../FeatureProperties";

export interface HoveredFeatureState {

    featureProperties: FeatureProperties | null
    setFeatureProperties: (featureProperties: FeatureProperties | null) => void


}
