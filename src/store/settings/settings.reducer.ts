import { setSelectAreaMode, setSelectedWeatherField, fetchWeatherFieldsSuccess, fetchWeatherFieldsFailed, setSelectedDateId, fetchWeatherDatesFailed, fetchWeatherDatesSuccess, setLoading, setIsSidebarOpen, setSuccessMsg, setErrorMsg, setInfoMsg, setRegionNamePath, setTableSelectedFeatures, setOpenTabId, setToggleDataButtonChecked } from "./settings.action";
import { AnyAction } from "redux";
import { TableFeature, WeatherDate, WeatherField } from "./settings.types";

export type SettingsState = {
  readonly areaMode: boolean,
  readonly weatherFields: WeatherField[],
  readonly selectedWeatherField: WeatherField | null,
  readonly weatherDates: WeatherDate[],
  readonly selectedDateId: string | null,
  readonly isSidebarOpen: boolean,
  readonly loading: boolean,
  readonly error: string | null,
  readonly success: string | null,
  readonly info: string | null,
  readonly regionNamePath: string,
  readonly tableSelectedFeatures: TableFeature[],
  readonly openTabId: number | null,
  toggleDataButtonChecked: boolean
}

const INITIAL_STATE: SettingsState = {
    areaMode: false,
    weatherFields: [],
    selectedWeatherField: null,
    weatherDates: [],
    selectedDateId: null,
    isSidebarOpen: false,
    loading: false,
    error: null,
    success: null,
    info: null,
    regionNamePath: '',
    tableSelectedFeatures: [],
    openTabId: null,
    toggleDataButtonChecked: false
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

  if (setIsSidebarOpen.match(action)) {
    return {
      ...state,
      isSidebarOpen: action.payload,
    }; 
  }

  if (setInfoMsg.match(action)) {
    return {
      ...state,
      info: action.payload,
    }; 
  }

  if (setErrorMsg.match(action)) {
    return {
      ...state,
      error: action.payload,
    }; 
  }

  if (setSuccessMsg.match(action)) {
    return {
      ...state,
      success: action.payload,
    }; 
  }

  if (setRegionNamePath.match(action)) {
    return {
      ...state,
      regionNamePath: action.payload
    }
  }

  if (setTableSelectedFeatures.match(action)) {
    return {
      ...state,
      tableSelectedFeatures: action.payload
    }
  }

  if (setOpenTabId.match(action)) {
    return {
      ...state,
      openTabId: action.payload
    }
  }

  if (setToggleDataButtonChecked.match(action)) {
    return {
      ...state,
      toggleDataButtonChecked: action.payload
    }
  }

  return state
}