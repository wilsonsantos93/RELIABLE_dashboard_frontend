import authHeader from "../../utils/reducer/authHeader.utils";
import { createAction, withMatcher, Action, ActionWithPayload } from "../../utils/reducer/reducer.utils";
import { setErrorMsg, setSuccessMsg, showErrorMsg, showSuccessMsg } from "../settings/settings.action";
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
                if (response.status === 401) throw "Credenciais incorretas.";
                if (response.status > 401) throw "Ocorreu um erro.";
            }
        
            const user = await response.json();
            dispatch(signInSuccess(user));
            dispatch(showSuccessMsg("Sessão iniciada!"));
        } catch (error) {
            dispatch(signInFailed(error as Error));
            throw error;
        }
    }
}

export const signUpUser = (data: any): AppThunk => {
    return async (dispatch) => {
        try {
            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: authHeader(),
                body: JSON.stringify(data)
            });
    
            if (!response?.ok) {
                if (response.status === 403) throw "Acesso negado.";
    
                const error = await response.json();
                
                switch (error) {
                    case "EMAIL_ALREADY_IN_USE":
                        throw "Endereço e-mail já em uso."
                    default:
                        throw "Ocorreu um erro.";
                }
            }
    
            const user = await response.json();
            dispatch(signInSuccess(user));
            dispatch(showSuccessMsg("Utilizador registado com sucesso. Sessão iniciada."));
        } catch (error) {
            dispatch(signUpFailed(error as Error));
            throw error;
        }
    }
}


export const setUserLocationsSuccess = withMatcher(
    (locations: any[]) => createAction(USER_ACTION_TYPES.SET_USER_LOCATIONS_SUCCESS, locations)
)

export const setUserLocationsFailed = withMatcher(
    (error: Error) => createAction(USER_ACTION_TYPES.SET_USER_LOCATIONS_FAILED, error)
)


export const addUserLocation = (userLocations: any[], position: any): AppThunk  => {
    return async (dispatch) => {
        try {
            if (!position) throw "Coordinates not specified";

            const response = await fetch(`http://localhost:8000/api/user/location`, {
                method: 'POST',
                headers: authHeader(),
                body: JSON.stringify({ name: null, position: position })
            });
            
            if (!response?.ok) throw "Não foi possível adicionar o marcador";

            const location = await response.json();
            const locations = [...userLocations, location];

            dispatch(setUserLocationsSuccess(locations));
            dispatch(showSuccessMsg("Marcador adicionado com sucesso!"));
        } catch (error) {
            dispatch(setUserLocationsFailed(error as Error));
            dispatch(showErrorMsg(error as string));
        }
    }
};

export const updateUserLocation = (userLocations: any[], item: any): AppThunk => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://localhost:8000/api/user/location/${item._id}/update`, {
                method: 'POST',
                headers: authHeader(),
                body: JSON.stringify(item)
            });
        
            if (!response?.ok) throw "Não foi possível atualizar o marcador";
        
            const locations = [...userLocations];
            const ix = locations.findIndex(location => location._id == item._id);
            locations[ix] = item;
            dispatch(setUserLocationsSuccess(locations));
            dispatch(showSuccessMsg("Marcador atualizado com sucesso!"));
        } catch (error) {
            dispatch(setUserLocationsFailed(error as Error));
            dispatch(showErrorMsg(error as string));
        }
    }

};
  
export const removeUserLocation = (userLocations: any[], id: string): AppThunk => {
    return async (dispatch) => {
        try {
            const response = await fetch(`http://localhost:8000/api/user/location/${id}/delete`, {
                method: 'POST',
                headers: authHeader(),
            });
            
            if (!response?.ok) throw "Não foi possível remover o marcador";

            const locations = userLocations.filter(location => location._id != id);
            dispatch(setUserLocationsSuccess(locations));
            dispatch(showSuccessMsg("Marcador removido com sucesso!"));
        } catch (error) {
            dispatch(setUserLocationsFailed(error as Error));
            dispatch(showErrorMsg(error as string));
        }
    }
};