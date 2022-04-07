import React, {Dispatch} from "react";

export interface WeatherDateSelectorProperties {
    setSelectedDate: Dispatch<React.SetStateAction<Date | undefined>>
}

export interface WeatherInfoSelectorProperties {
    setSelectedInfo: Dispatch<React.SetStateAction<"Temperature" | "WindSpeed" | undefined>>
}