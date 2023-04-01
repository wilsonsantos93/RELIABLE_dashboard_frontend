import { MAP_ACTION_TYPES } from "./map.types";
import { createAction, withMatcher } from "../../utils/reducer/reducer.utils";
import { AppThunk } from "../store";
import { fetchWeatherGeoJSON } from "../../data/fetchWeatherGeoJSON";
import { showErrorMsg } from "../settings/settings.action";
import { GeoJsonObject } from "geojson";
import authHeader from "../../utils/reducer/authHeader.utils";

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


// Next layer
export const setNextLayer = withMatcher(
    (feature: any) => createAction(MAP_ACTION_TYPES.SET_NEXT_LAYER, feature)
)

export const updateNextLayer = (layer: any) => {
    return setNextLayer(layer);
}


// Select feature
export const setSelectedFeature = withMatcher(
    (feature: any) => createAction(MAP_ACTION_TYPES.SET_SELECTED_FEATURE, feature)
)

export const selectFeature = (feature: any) => {
    return setSelectedFeature(feature);
}

// Fetch geojson data
export const setGeoJsonData = withMatcher(
    (data: GeoJsonObject) => createAction(MAP_ACTION_TYPES.SET_GEOJSON_DATA, data)
)

export const getGeoJsonData = (dateId: string): AppThunk => {
    return async (dispatch) => {
        try {
            const data = await fetchWeatherGeoJSON(dateId);
            return data;
        } catch (error) {
            dispatch(showErrorMsg(error as string));
        }
    }
};

// Fetch weather alerts for user
export const setWeatherAlerts = withMatcher(
    (data: any[]) => createAction(MAP_ACTION_TYPES.SET_WEATHER_ALERTS, data)
)

export const getWeatherAlerts = (): AppThunk => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://localhost:8000/api/user/alerts`, {
                method: 'GET',
                headers: authHeader(),
            });
            
            if (!response?.ok) throw "Não foi possível obter os alertas";
            const data = await response.json();
            dispatch(setWeatherAlerts(data));
        } catch (error) {
            dispatch(showErrorMsg(error as string));
        }
    }
};