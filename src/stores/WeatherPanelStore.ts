import React, { createRef, MutableRefObject } from 'react';
import create from 'zustand'
import {WeatherPanelState} from "../types/stores/WeatherPanelState";

const WeatherPanelStore = create<WeatherPanelState>((set) => ({

    selectedDateDatabaseId: undefined,
    setSelectedDateDatabaseId: (selectedDateDatabaseId) => set(state => ({
        selectedDateDatabaseId: selectedDateDatabaseId
    })),

    selectedInformation: undefined,
    setSelectedInformation: (selectedInformation) => set(state => ({
        selectedInformation: selectedInformation
    })),

    loading: true,
    setLoading: (bool) => set(state => ({
        loading: bool
    })),

    data: true,
    setData: (data) => set(state => ({
        data: data
    })),

    weatherFields: [],
    setWeatherFields: (fields) => set(state => ({
        weatherFields: fields
    })),

    clickedFeature: null,
    setClickedFeature: (feature) => set(state => ({
        clickedFeature: feature
    })),

    comparedFeatures: [],
    setComparedFeatures: (data: any[]) => set(state => ({
        comparedFeatures: data
    })),

    comparisonMode: false,
    setComparisonMode: () => set(state => ({
        comparisonMode: !state.comparisonMode
    }))
}))


export default WeatherPanelStore;

