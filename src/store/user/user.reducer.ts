import { signInFailed, signInSuccess, signOutFailed, signUpFailed, signOutSuccess, setUserLocationsFailed, setUserLocationsSuccess } from "./user.action";
import { AnyAction } from "redux";

export type UserState = {
  readonly currentUser: any | null,
  readonly token: string | null,
  readonly locations: any[],
  readonly error: Error | null
}

const INITIAL_STATE: UserState = {
  currentUser: null,
  token: null,
  locations: [],
  error: null,
};

export const userReducer = (state = INITIAL_STATE, action: AnyAction): UserState => {
 /*  const { type, payload } = action; */

  if (signInSuccess.match(action)) {
    return {
      ...state,
      currentUser: action.payload.user,
      locations: action.payload.user.locations,
      token: action.payload.jwt,
      error: null
    }; 
  }

  if (signOutFailed.match(action) || signUpFailed.match(action) || signInFailed.match(action) || setUserLocationsFailed.match(action)) {
    return {
      ...state,
      error: action.payload,
    };
  }

  if (signOutSuccess.match(action)) {
    return {
      ...state,
      currentUser: null,
      token: null,
      locations: [],
      error: null
    };
  }

  if (setUserLocationsSuccess.match(action)) {
    return {
      ...state,
      error: null,
      locations: action.payload
    };
  }

  return state
}