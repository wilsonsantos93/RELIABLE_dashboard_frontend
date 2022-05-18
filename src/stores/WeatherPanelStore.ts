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


}))


export default WeatherPanelStore;

