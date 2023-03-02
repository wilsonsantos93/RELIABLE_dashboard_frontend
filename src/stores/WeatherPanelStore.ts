import create from 'zustand'
import {WeatherPanelState} from "../models/stores/WeatherPanelState";

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
    }))

}))


export default WeatherPanelStore;

