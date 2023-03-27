import { createSelector } from "reselect";
import { RootState } from "../store";
import { RefsState } from "./refs.reducer";

const selectRefsReducer = (state: RootState): RefsState => state.refs;

export const selectGeoJsonLayerRef = createSelector(
    [selectRefsReducer],
    (refsSlice: RefsState) => refsSlice.geoJsonLayerRef
)

export const selectSidebarRef = createSelector(
    [selectRefsReducer],
    (refsSlice: RefsState) => refsSlice.sidebarRef
)