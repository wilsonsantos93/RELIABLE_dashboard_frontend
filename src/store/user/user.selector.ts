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
    [selectUser],
    (user) => user.locations
) 

export const selectUserIsLoggedIn = createSelector(
    [selectUserToken],
    (token) => !!token
) 