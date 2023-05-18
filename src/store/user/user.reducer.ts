import { signInFailed, signInSuccess, signOutFailed, signUpFailed, signOutSuccess, setUserLocationsFailed, setUserLocationsSuccess, setWeatherAlerts, setUserPreferences } from "./user.action";
import { AnyAction } from "redux";
import { User, UserLocation, WeatherAlertObject } from "./user.types";

export type UserState = {
  readonly currentUser: User | null,
  readonly token: string | null,
  readonly locations: UserLocation[],
  readonly error: Error | null,
  readonly weatherAlerts: WeatherAlertObject | null,
  readonly alertByEmail: boolean
}

const INITIAL_STATE: UserState = {
  currentUser: null,
  token: null,
  locations: [],
  error: null,
  weatherAlerts: null,
  alertByEmail: true
};

export const userReducer = (state = INITIAL_STATE, action: AnyAction): UserState => {

  if (signInSuccess.match(action)) {
    return {
      ...state,
      currentUser: action.payload.user,
      locations: action.payload.user.locations,
      token: action.payload.jwt,
      alertByEmail: action.payload.user.alertByEmail,
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

  if (setWeatherAlerts.match(action)) {
    return {
      ...state,
      weatherAlerts: action.payload
    }; 
  }

  if (setUserPreferences.match(action)) {
    return {
      ...state,
      alertByEmail: action.payload.alertByEmail
    }; 
  }
  return state
}