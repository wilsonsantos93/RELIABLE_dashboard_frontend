import { useSelector } from "react-redux";
import { selectSelectedDateId, selectSelectedWeatherField, selectWeatherDates } from "../../../store/settings/settings.selector";
import "./date-indicator.styles.css";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(timezone);
dayjs.extend(utc);

const DateIndicator = () => {
    const selectedDateId = useSelector(selectSelectedDateId);
    const weatherDates = useSelector(selectWeatherDates);
    const selectedWeatherField = useSelector(selectSelectedWeatherField);

    const getFormattedDate = () => {
        if (!selectedDateId || !weatherDates) return null;
        const date = weatherDates.find(d => d._id == selectedDateId);
        if (!date) return null;

        const containsHours = date.format.includes(":") ? true : false;

        return <span>{dayjs(date.date).tz("Europe/Lisbon").format(`D MMMM YYYY ${containsHours ? "HH:mm" : ''}` )}</span>
        //return <span>{dayjs(date.date).tz("Europe/Lisbon").format(date.format)}</span>
    }
    
    return (
        <div className="date-indicator">
          { selectedWeatherField?.displayName } referente a { getFormattedDate() }
        </div>
    )
}

export default DateIndicator;