import { setComparedFeatures, setHoveredFeature, setSelectedFeature } from "./map.action";
import { AnyAction } from "redux";

export type MapState = {
  readonly comparedFeatures: any[];
  readonly selectedFeature: any;
  readonly hoveredFeature: any;
}

const INITIAL_STATE: MapState = {
  comparedFeatures: [],
  selectedFeature: null,
  hoveredFeature: null
};

export const mapReducer = (state = INITIAL_STATE, action: AnyAction): MapState => {

  if (setComparedFeatures.match(action)) {
    return {
      ...state,
      comparedFeatures: action.payload
    }; 
  }

  if (setSelectedFeature.match(action)) {
    return {
      ...state,
      selectedFeature: action.payload
    }; 
  }

  if (setHoveredFeature.match(action)) {
    return {
      ...state,
      hoveredFeature: action.payload
    }; 
  }

  return state
}