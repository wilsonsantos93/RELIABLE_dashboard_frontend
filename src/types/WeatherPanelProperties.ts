import React, {Dispatch} from "react";

export interface PanelProperties {
    selectedDate?: Date
    setSelectedDate: Dispatch<React.SetStateAction<Date | undefined>>
    setSelectedInfo: Dispatch<React.SetStateAction<"Temperature" | "WindSpeed" | undefined>>
    selectedInfo?: "Temperature" | "WindSpeed"
}

export interface WeatherDateSelectorProperties {
    setSelectedDate: Dispatch<React.SetStateAction<Date | undefined>>
}

export interface WeatherInfoSelectorProperties {
    setSelectedInfo: Dispatch<React.SetStateAction<"Temperature" | "WindSpeed" | undefined>>
}