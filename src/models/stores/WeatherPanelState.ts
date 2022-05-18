export interface WeatherPanelState {

    selectedDateDatabaseId: string | undefined
    setSelectedDateDatabaseId: (selectedDateDatabaseId: string | undefined) => void

    selectedInformation: "Temperature" | "WindSpeed" | undefined
    setSelectedInformation: (selectedInformation: "Temperature" | "WindSpeed" | undefined) => void
}
