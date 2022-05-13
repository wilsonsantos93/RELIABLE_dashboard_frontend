import create from 'zustand'
import {WeatherPanelState} from "../models/stores/WeatherPanelState";

const WeatherPanelStore = create<WeatherPanelState>((set) => ({

    selectedDate: undefined,
    setSelectedDate: (selectedDate) => set(state => ({
        selectedDate: selectedDate
    })),

    selectedInformation: undefined,
    setSelectedInformation: (selectedInformation) => set(state => ({
        selectedInformation: selectedInformation
    })),

}))


export default WeatherPanelStore;

