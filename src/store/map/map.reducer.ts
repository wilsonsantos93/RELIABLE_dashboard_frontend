import { setComparedFeatures, setGeoJsonData, setHoveredFeature, setNextLayer, setSelectedFeature, setWeatherAlerts } from "./map.action";
import { AnyAction } from "redux";

export type MapState = {
  readonly comparedFeatures: any[];
  readonly selectedFeature: any;
  readonly hoveredFeature: any;
  readonly geoJsonData: any;
  readonly weatherAlerts: any[];
  readonly nextLayer: any;
}

const INITIAL_STATE: MapState = {
  comparedFeatures: [],
  selectedFeature: null,
  hoveredFeature: null,
  geoJsonData: null,
  weatherAlerts: [],
  nextLayer: null
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

  if (setGeoJsonData.match(action)) {
    return {
      ...state,
      geoJsonData: action.payload
    }; 
  }

  if (setWeatherAlerts.match(action)) {
    return {
      ...state,
      weatherAlerts: action.payload
    }; 
  }

  if (setNextLayer.match(action)) {
    return {
      ...state,
      nextLayer: action.payload
    }; 
  }

  return state
}