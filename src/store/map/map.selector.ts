import { createSelector } from "reselect";
import { RootState } from "../store";
import { MapState } from "./map.reducer";

const selectMapReducer = (state: RootState): MapState => state.map;

export const selectComparedFeatures = createSelector(
    [selectMapReducer],
    (mapSlice: MapState) => mapSlice.comparedFeatures
)

export const selectSelectedFeature = createSelector(
    [selectMapReducer],
    (mapSlice: MapState) => mapSlice.selectedFeature
)

export const selectHoveredFeature = createSelector(
    [selectMapReducer],
    (mapSlice: MapState) => mapSlice.hoveredFeature
)

export const selectGeoJsonData = createSelector(
    [selectMapReducer],
    (mapSlice: MapState) => mapSlice.geoJsonData
)

export const selectNextLayer = createSelector(
    [selectMapReducer],
    (mapSlice: MapState) => mapSlice.nextLayer
)