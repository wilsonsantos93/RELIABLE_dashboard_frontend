export enum SETTINGS_ACTION_TYPES {
    SET_SELECT_AREA_MODE = "settings/SET_SELECT_AREA_MODE",
    SET_SELECTED_WEATHER_FIELD = "settings/SET_SELECTED_WEATHER_FIELD",
    SET_SELECTED_DATE_ID = "settings/SET_SELECTED_DATE_ID",
    SET_LOADING = "settings/SET_LOADING",
    SET_IS_SIDEBAR_OPEN = "settings/SET_IS_SIDEBAR_OPEN",
    FETCH_WEATHER_FIELDS_SUCCESS = "settings/FETCH_WEATHER_FIELDS_SUCCESS",
    FETCH_WEATHER_FIELDS_FAILED = "settings/FETCH_WEATHER_FIELDS_FAILED",
    FETCH_WEATHER_DATES_SUCCESS = "settings/FETCH_WEATHER_DATES_SUCCESS",
    FETCH_WEATHER_DATES_FAILED = "settings/FETCH_WEATHER_DATES_FAILED",
    SET_ERROR_MESSAGE = "settings/SET_ERROR_MESSAGE",
    SET_INFO_MESSAGE = "settings/SET_INFO_MESSAGE",
    SET_SUCCESS_MESSAGE = "settings/SET_SUCCESS_MESSAGE",
    SET_REGION_NAME_PATH = "settings/SET_REGION_NAME_PATH",
    SET_TABLE_SELECTED_FEATURES = "settings/SET_TABLE_SELECTED_FEATURES",
    SET_OPEN_TAB_ID = "settings/SET_OPEN_TAB_ID",
    SET_TOGGLE_DATA_BUTTON_CHECKED = "settings/SET_TOGGLE_DATA_BUTTON_CHECKED"
};

export type WeatherDate = {
    _id: string,
    date: string | Date,
    format: string
}

export type WeatherField = {
    _id: string,
    name: string,
    viewOrder: number,
    active: boolean,
    main: boolean,
    unit: string,
    description: string,
    displayName: string,
    ranges: WeatherFieldRange[]
}

export type WeatherFieldRange = {
    min: number,
    max: number,
    alert: boolean,
    color: string,
    recommendations: string[],
    label: string
}

export type TableFeature = {
    _id: string,
    checked: boolean,
    local: string
}