import { MAP_ACTION_TYPES } from "./map.types";
import { createAction, withMatcher } from "../../utils/reducer/reducer.utils";

// Set compared features
export const setComparedFeatures = withMatcher(
    (features: any[]) => createAction(MAP_ACTION_TYPES.SET_COMPARED_FEATURES, features)
)

export const addFeatureToComparedFeatures = (comparedFeatures: any[], feature: any) => {
    const features = [feature, ...comparedFeatures]
    return setComparedFeatures(features);
}

export const addFeaturesToComparedFeatures = (comparedFeatures: any[], features: any[]) => {
    const newComparedFeatures = [...comparedFeatures, ...features]
    return setComparedFeatures(newComparedFeatures);
}

export const updateComparedFeatures = (features: any[]) => {
    return setComparedFeatures(features);
}

export const removeFromComparedFeatures = (comparedFeatures: any[], featureId: string) => {
    const features = comparedFeatures.filter((f:any) => f._id !== featureId);
    return setComparedFeatures(features);
}


// Hover feature
export const setHoveredFeature = withMatcher(
    (feature: any) => createAction(MAP_ACTION_TYPES.SET_HOVERED_FEATURE, feature)
)

export const hoverFeature = (feature: any) => {
    return setHoveredFeature(feature);
}


// Select feature
export const setSelectedFeature = withMatcher(
    (feature: any) => createAction(MAP_ACTION_TYPES.SET_SELECTED_FEATURE, feature)
)

export const selectFeature = (feature: any) => {
    return setSelectedFeature(feature);
}