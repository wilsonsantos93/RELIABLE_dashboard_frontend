import { REFS_ACTION_TYPES } from "./refs.types";
import { createAction, withMatcher } from "../../utils/reducer/reducer.utils";

// Set geoJsonLayerRef
export const setGeoJsonLayerRef = withMatcher(
    (ref: React.RefObject<any>) => createAction(REFS_ACTION_TYPES.SET_GEOJSONLAYER_REF, ref)
)

export const setGeoJsonLayer = (ref: React.RefObject<any>) => {
    return setGeoJsonLayerRef(ref);
}

// Set sidebarRef
export const setSidebarRef = withMatcher(
    (ref: React.RefObject<any>) => createAction(REFS_ACTION_TYPES.SET_SIDEBAR_REF, ref)
)

export const setSidebar = (ref: React.RefObject<any>) => {
    return setSidebarRef(ref);
}