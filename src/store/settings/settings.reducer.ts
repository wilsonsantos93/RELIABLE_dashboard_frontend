import { setSelectAreaMode, setSelectedWeatherField, fetchWeatherFieldsSuccess, fetchWeatherFieldsFailed, setSelectedDateId, fetchWeatherDatesFailed, fetchWeatherDatesSuccess, setLoading } from "./settings.action";
import { AnyAction } from "redux";

export type SettingsState = {
  readonly areaMode: boolean,
  readonly weatherFields: any[],
  readonly selectedWeatherField: any,
  readonly weatherDates: any[],
  readonly selectedDateId: string | null,
  readonly isSidebarOpen: boolean,
  readonly loading: boolean,
  readonly error: Error | null
}

const INITIAL_STATE: SettingsState = {
    areaMode: false,
    weatherFields: [],
    selectedWeatherField: null,
    weatherDates: [],
    selectedDateId: null,
    isSidebarOpen: false,
    loading: false,
    error: null
};

export const settingsReducer = (state = INITIAL_STATE, action: AnyAction): SettingsState => {

  if (setSelectAreaMode.match(action)) {
    return {
      ...state,
      error: null,
      areaMode: action.payload
    }; 
  }

  if (setSelectedWeatherField.match(action)) {
    return {
      ...state,
      error: null,
      selectedWeatherField: action.payload
    }; 
  }

  if (setSelectedDateId.match(action)) {
    return {
      ...state,
      error: null,
      selectedDateId: action.payload
    }; 
  }

  if (fetchWeatherFieldsSuccess.match(action)) {
    return {
      ...state,
      error: null,
      weatherFields: action.payload
    }; 
  }

  if (fetchWeatherDatesSuccess.match(action)) {
    return {
      ...state,
      error: null,
      weatherDates: action.payload
    }; 
  }

  if (fetchWeatherFieldsFailed.match(action) || fetchWeatherDatesFailed.match(action)) {
    return {
      ...state,
      error: action.payload,
    }; 
  }

  if (setLoading.match(action)) {
    return {
      ...state,
      loading: action.payload,
    }; 
  }

  return state
}