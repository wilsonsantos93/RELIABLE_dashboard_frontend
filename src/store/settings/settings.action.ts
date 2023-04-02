import { SETTINGS_ACTION_TYPES } from "./settings.types";
import { createAction, withMatcher } from "../../utils/reducer/reducer.utils";
import { AppThunk } from "../store";
import { fetchWeatherFields } from "../../data/fetchWeatherFields";
import { fetchWeatherDates } from "../../data/fetchWeatherDates";
import authHeader from "../../utils/reducer/authHeader.utils";


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
            let data = await fetchWeatherFields();
            data = data.filter((d:any) => d.active);
            dispatch(fetchWeatherFieldsSuccess(data));
            const mainField = data.find((f:any) => f.main == true);
            if (mainField) dispatch(setWeatherField(mainField));
            else dispatch(setWeatherField(data[0]));
        } catch (error) {
            dispatch(showErrorMsg("Não foi possível obter os metadados."));
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
            const datesSorted = [...dates]; 
            datesSorted.sort((a,b) => a.date.valueOf() + b.date.valueOf())
            const firstDate = datesSorted.find(d => d.date.valueOf() <= new Date().valueOf());
            if (firstDate) dispatch(setDateId(firstDate?._id));
        } catch (error) {
            dispatch(showErrorMsg("Não foi possível obter as datas."));
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


// region name path
export const getRegionPathName = (): AppThunk => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://localhost:8000/api/metadata`, {
                method: 'GET',
                headers: authHeader(),
            });

            if (!response.ok) throw "";

            const data = await response.json();
            const path = data.DB_REGION_NAME_FIELD;
            dispatch(setRegionNamePath(path));
        } catch (error) {
            dispatch(showErrorMsg("Não foi possível obter os metadados."));
        }
    }
}

export const setRegionNamePath = withMatcher(
    (path: string) => createAction(SETTINGS_ACTION_TYPES.SET_REGION_NAME_PATH, path)
)