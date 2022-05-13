export interface WeatherPanelState {


    selectedDate: string | undefined
    setSelectedDate: (selectedDate: string | undefined) => void

    selectedInformation: "Temperature" | "WindSpeed" | undefined
    setSelectedInformation: (selectedInformation: "Temperature" | "WindSpeed" | undefined) => void


}
