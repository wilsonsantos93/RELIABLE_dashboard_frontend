import create from 'zustand'
import {WeatherPanelState} from "../types/stores/WeatherPanelState";

const WeatherPanelStore = create<WeatherPanelState>((set, get) => ({

    selectMode: null,
    setSelectMode: (mode) => set(state => ({
        selectMode: mode
    })),

    /* selectAreaMode: false,
    setSelectAreaMode: (bool) => set(state => ({
        selectAreaMode: bool == undefined ? !state.selectAreaMode : bool
    })), */

    geoJsonLayerRef: undefined,
    setGeoJsonLayerRef: (ref: any) => set(state => ({
        geoJsonLayerRef: ref
    })),

    selectedDateDatabaseId: undefined,
    setSelectedDateDatabaseId: (selectedDateDatabaseId) => set(state => ({
        selectedDateDatabaseId: selectedDateDatabaseId
    })),

    selectedInformation: undefined,
    setSelectedInformation: (selectedInformation) => set(state => ({
        selectedInformation: selectedInformation
    })),

    selectedWeatherMetadata: () => {
        const weatherFields = get().weatherFields;
        const selectedWeatherField = get().selectedInformation;
        const field = weatherFields.find(w => w.name === selectedWeatherField);
        return field;
    },

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
    setComparisonMode: (bool) => set(state => ({
        comparisonMode: bool == undefined ? !state.comparisonMode : bool
    }))
}))


export default WeatherPanelStore;