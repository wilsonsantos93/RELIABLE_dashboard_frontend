import { setGeoJsonLayerRef, setSidebarRef } from "./refs.action";
import { AnyAction } from "redux";

export type RefsState = {
  readonly geoJsonLayerRef: React.RefObject<any> | null
  readonly sidebarRef: React.RefObject<any> | null,
}

const INITIAL_STATE: RefsState = {
    geoJsonLayerRef: null,
    sidebarRef: null
};

export const refsReducer = (state = INITIAL_STATE, action: AnyAction): RefsState => {

  if (setGeoJsonLayerRef.match(action)) {
    return {
      ...state,
      geoJsonLayerRef: action.payload
    }; 
  }

  if (setSidebarRef.match(action)) {
    return {
      ...state,
      sidebarRef: action.payload
    }; 
  }

  return state
}