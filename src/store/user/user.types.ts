import { WeatherDate } from "../settings/settings.types"

export enum USER_ACTION_TYPES {
    SIGN_IN_SUCCESS = "user/SIGN_IN_SUCCESS",
    SIGN_IN_FAILED = "user/SIGN_IN_FAILED",
    SIGN_UP_FAILED = "user/SIGN_UP_FAILED",
    SIGN_OUT_SUCCESS = "user/SIGN_OUT_SUCCESS",
    SIGN_OUT_FAILED = "user/SIGN_OUT_FAILED",
    SET_USER_LOCATIONS_SUCCESS = "user/SET_USER_LOCATIONS_SUCCESS",
    SET_USER_LOCATIONS_FAILED = "user/SET_USER_LOCATIONS_FAILED",
    SET_WEATHER_ALERTS = "user/SET_WEATHER_ALERTS"
};

export type User = {
    _id: string,
    email: string,
    username?: string,
    locations: UserLocation[],
    role: string
}

export type UserLocation = {
    _id: string,
    name: string,
    position: { lat: number, lng: number }
}

export type EmailSignIn = {
    username: string, 
    password: string
}

export type EmailSignUp = EmailSignIn & {
    confirmPassword: string
}

export type ChangePassword = {
    password: string,
    confirmPassword: string
}

export type WeatherAlertObject = {
    numDaysAhead: number,
    alerts: WeatherAlert[]
}

export type WeatherAlert = {
    _id: string,
    regionBorderFeatureObjectId: string,
    weatherDateObjectId: string,
    regionName: string,
    weather: { [key: string]: number },
    date: WeatherDate[]
}