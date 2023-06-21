import { WeatherDate } from "../store/settings/settings.types";

export default function getFirstDate(dates: WeatherDate[]) {
    if (!dates.length) return null;

    const datesSorted = [...dates]; 
    datesSorted.sort((a,b) => {
        const valueA = new Date(a.date).valueOf();
        const valueB = new Date(b.date).valueOf();
        if (valueA < valueB) return -1;
        else return 1;
    });

    return datesSorted[0];
}