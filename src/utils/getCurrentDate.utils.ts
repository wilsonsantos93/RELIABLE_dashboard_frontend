import { WeatherDate } from "../store/settings/settings.types";

export default function getCurrentDate(dates: WeatherDate[]) {
    const datesSorted = [...dates]; 
    datesSorted.sort((a,b) => {
        const valueA = new Date(a.date).valueOf();
        const valueB = new Date(b.date).valueOf();
        if (valueA >= valueB) return -1;
        else return 1;
    });

    const firstDate = datesSorted.find(d => new Date(d.date).valueOf() <= new Date().valueOf());
    return firstDate;
}