import { SETTINGS_ACTION_TYPES } from "./settings.types";
import { createAction, withMatcher } from "../../utils/reducer/reducer.utils";
import { AppThunk } from "../store";
import { fetchWeatherFields } from "../../data/fetchWeatherFields";
import { fetchWeatherDates } from "../../data/fetchWeatherDates";


// Set "Select Area" mode
export const setSelectAreaMode = withMatcher(
    (bool: boolean) => createAction(SETTINGS_ACTION_TYPES.SET_SELECT_AREA_MODE, bool)
)

export const setAreaMode = (bool: boolean) => {
    return setSelectAreaMode(bool);
}


// Set selectedWeatherField
export const setSelectedWeatherField = withMatcher(
    (weatherField: any) => createAction(SETTINGS_ACTION_TYPES.SET_SELECTED_WEATHER_FIELD, weatherField)
)

export const setWeatherField = (weatherField: any) => {
    return setSelectedWeatherField(weatherField);
}


// Get weather fields
export const fetchWeatherFieldsSuccess = withMatcher(
    (weatherFields: any[]) => createAction(SETTINGS_ACTION_TYPES.FETCH_WEATHER_FIELDS_SUCCESS, weatherFields)
)

export const fetchWeatherFieldsFailed = withMatcher(
    (error: string) => createAction(SETTINGS_ACTION_TYPES.FETCH_WEATHER_FIELDS_FAILED, error)
)

export const getWeatherFields = (): AppThunk => {
    return async (dispatch) => {
        try {
            const data = await fetchWeatherFields();
            dispatch(fetchWeatherFieldsSuccess(data));
            dispatch(setWeatherField(data[0]));
        } catch (error) {
            dispatch(fetchWeatherFieldsFailed(error as string));
        }
    }
}


// Get weather dates
export const fetchWeatherDatesSuccess = withMatcher(
    (dates: any[]) => createAction(SETTINGS_ACTION_TYPES.FETCH_WEATHER_DATES_SUCCESS, dates)
)

export const fetchWeatherDatesFailed = withMatcher(
    (error: string) => createAction(SETTINGS_ACTION_TYPES.FETCH_WEATHER_DATES_FAILED, error)
)

export const getWeatherDates = (): AppThunk => {
    return async (dispatch) => {
        try {
            const dates = await fetchWeatherDates();
            dispatch(fetchWeatherDatesSuccess(dates));
            const firstDate = dates.find(d => d.date.valueOf() <= new Date().valueOf());
            if (firstDate) dispatch(setDateId(firstDate?._id));
        } catch (error) {
            dispatch(fetchWeatherFieldsFailed(error as string));
        }
    }
}

// Set selectedDateId
export const setSelectedDateId = withMatcher(
    (dateId: string) => createAction(SETTINGS_ACTION_TYPES.SET_SELECTED_DATE_ID, dateId)
)

export const setDateId = (dateId: string) => {
    return setSelectedDateId(dateId);
}


// Loading
export const setLoading = withMatcher(
    (bool: boolean) => createAction(SETTINGS_ACTION_TYPES.SET_LOADING, bool)
)

export const changeLoading = (bool: boolean) => {
    return setLoading(bool);
}


// is sidebar open
export const setIsSidebarOpen = withMatcher(
    (bool: boolean) => createAction(SETTINGS_ACTION_TYPES.SET_IS_SIDEBAR_OPEN, bool)
)

export const openSidebar = (bool: boolean) => {
    return setIsSidebarOpen(bool);
}


// set messages
export const setInfoMsg = withMatcher(
    (msg: string | null) => createAction(SETTINGS_ACTION_TYPES.SET_INFO_MESSAGE, msg)
)

export const setErrorMsg = withMatcher(
    (msg: string | null) => createAction(SETTINGS_ACTION_TYPES.SET_ERROR_MESSAGE, msg)
)

export const setSuccessMsg = withMatcher(
    (msg: string | null) => createAction(SETTINGS_ACTION_TYPES.SET_SUCCESS_MESSAGE, msg)
)


export const showInfoMsg = (msg: string | null) => {
    return setInfoMsg(msg);
}

export const showErrorMsg = (msg: string | null) => {
    return setErrorMsg(msg);
}

export const showSuccessMsg = (msg: string | null) => {
    return setSuccessMsg(msg);
}