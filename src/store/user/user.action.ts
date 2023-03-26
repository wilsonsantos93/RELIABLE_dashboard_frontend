import authHeader from "../../utils/reducer/authHeader.utils";
import { createAction, withMatcher, Action, ActionWithPayload } from "../../utils/reducer/reducer.utils";
import { AppThunk } from "../store";
import { USER_ACTION_TYPES } from "./user.types";

export type EmailSignIn = {
    email: string, 
    password: string
}

export type SignInSuccess = ActionWithPayload<USER_ACTION_TYPES.SIGN_IN_SUCCESS, any>
export type SignInFailed = ActionWithPayload<USER_ACTION_TYPES.SIGN_IN_FAILED, Error>
export type SignUpFailed = ActionWithPayload<USER_ACTION_TYPES.SIGN_UP_FAILED, Error>
export type SignOutSuccess = Action<USER_ACTION_TYPES.SIGN_OUT_SUCCESS>
export type SignOutFailed = ActionWithPayload<USER_ACTION_TYPES.SIGN_OUT_FAILED, Error>

export const signInSuccess = withMatcher(
    (user: any) => createAction(USER_ACTION_TYPES.SIGN_IN_SUCCESS, user)
)

export const signInFailed = withMatcher(
    (error: Error) => createAction(USER_ACTION_TYPES.SIGN_IN_FAILED, error)
)

export const signUpFailed = withMatcher(
    (error: Error) => createAction(USER_ACTION_TYPES.SIGN_UP_FAILED, error)
)

export const signOutSuccess = withMatcher(
    () => createAction(USER_ACTION_TYPES.SIGN_OUT_SUCCESS)
)

export const signOutFailed = withMatcher(
    (error: Error) => createAction(USER_ACTION_TYPES.SIGN_OUT_FAILED, error)
)

export const loginUser = (credentials: any): AppThunk => {
    return async (dispatch) => {
        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: authHeader(),
                body: JSON.stringify(credentials)
            });
        
            if (!response?.ok) {
                if (response.status == 401) throw "Credenciais incorretas.";
                if (response.status > 401) throw "Ocorreu um erro.";
            }
        
            const user = await response.json();
            dispatch(signInSuccess(user));
        } catch (error) {
            dispatch(signInFailed(error as Error));
            throw error;
        }
    }
}


export const setUserLocations = withMatcher(
    (locations: any[]) => createAction(USER_ACTION_TYPES.SET_USER_LOCATIONS, locations)
)

export const addUserLocation = (userLocations: any[], item: any)  => {
    const locations = [...userLocations, item];
    return setUserLocations(locations);
};

export const updateUserLocation = (userLocations: any[], item: any): AppThunk => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://localhost:8000/api/user/location/${item._id}/update`, {
                method: 'POST',
                headers: authHeader(),
                body: JSON.stringify(item)
            });
        
            if (!response?.ok) {
                if (response.status == 401) throw "Credenciais incorretas.";
                if (response.status > 401) throw "Ocorreu um erro.";
            }
        
            //const user = await response.json();
            const ix = userLocations.findIndex(location => location._id == item._id);
            const locations = [...userLocations];
            locations[ix] = item;
            console.log(item)
            dispatch(setUserLocations(locations));
        } catch (error) {
            //dispatch(signInFailed(error as Error));
            throw error;
        }
    }

};
  
export const removeUserLocation = (userLocations: any[], id: string) => {
    const locations = userLocations.filter(location => location._id != id);
    return setUserLocations(locations);
};