import { createSelector } from "reselect";
import { RootState } from "../store";
import { SettingsState } from "./settings.reducer";

const selectSettingsReducer = (state: RootState): SettingsState => state.settings;

export const selectAreaMode = createSelector(
    [selectSettingsReducer],
    (settingsSlice: SettingsState) => settingsSlice.areaMode
)

export const selectSelectedWeatherField = createSelector(
    [selectSettingsReducer],
    (settingsSlice: SettingsState) => settingsSlice.selectedWeatherField
)

export const selectWeatherFields = createSelector(
    [selectSettingsReducer],
    (settingsSlice: SettingsState) => settingsSlice.weatherFields
)

export const selectMainWeatherField = createSelector(
    [selectWeatherFields],
    (weatherFields) => weatherFields.find(f => f.main)
)

export const selectSelectedDateId = createSelector(
    [selectSettingsReducer],
    (settingsSlice: SettingsState) => settingsSlice.selectedDateId
)

export const selectWeatherDates = createSelector(
    [selectSettingsReducer],
    (settingsSlice: SettingsState) => settingsSlice.weatherDates
)

export const selectIsSidebarOpen = createSelector(
    [selectSettingsReducer],
    (settingsSlice: SettingsState) => settingsSlice.isSidebarOpen
)

export const selectOpenTabId = createSelector(
    [selectSettingsReducer],
    (settingsSlice: SettingsState) => settingsSlice.openTabId
)

export const selectLoading = createSelector(
    [selectSettingsReducer],
    (settingsSlice: SettingsState) => settingsSlice.loading
)

export const selectInfoMsg = createSelector(
    [selectSettingsReducer],
    (settingsSlice: SettingsState) => settingsSlice.info
)

export const selectErrorMsg = createSelector(
    [selectSettingsReducer],
    (settingsSlice: SettingsState) => settingsSlice.error
)

export const selectSuccessMsg = createSelector(
    [selectSettingsReducer],
    (settingsSlice: SettingsState) => settingsSlice.success
)

export const selectRegionNamePath = createSelector(
    [selectSettingsReducer],
    (settingsSlice: SettingsState) => settingsSlice.regionNamePath
)

export const selectTableSelectedFeatures = createSelector(
    [selectSettingsReducer],
    (settingsSlice: SettingsState) => settingsSlice.tableSelectedFeatures
)

export const selectToggleDataButtonChecked = createSelector(
    [selectSettingsReducer],
    (settingsSlice: SettingsState) => settingsSlice.toggleDataButtonChecked
)