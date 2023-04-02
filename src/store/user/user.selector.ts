import { createSelector } from "reselect";
import { RootState } from "../store";
import { UserState } from "./user.reducer";

const selectUserReducer = (state: RootState): UserState => state.user;

export const selectUser = createSelector(
    [selectUserReducer],
    (userSlice: UserState) => userSlice.currentUser
)

export const selectUserToken = createSelector(
    [selectUserReducer],
    (userSlice) => userSlice.token
)

export const selectUserLocations = createSelector(
    [selectUserReducer],
    (userSlice) => userSlice.locations
) 

export const selectUserIsLoggedIn = createSelector(
    [selectUserToken],
    (token) => !!token
) 

export const selectWeatherAlerts = createSelector(
    [selectUserReducer],
    (userSlice: UserState) => userSlice.weatherAlerts
)