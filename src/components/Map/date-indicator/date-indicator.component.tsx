import { useSelector } from "react-redux";
import { selectSelectedDateId, selectWeatherDates } from "../../../store/settings/settings.selector";
import "./date-indicator.styles.css";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(timezone);
dayjs.extend(utc);

const DateIndicator = () => {
    const selectedDateId = useSelector(selectSelectedDateId);
    const weatherDates = useSelector(selectWeatherDates);

    const getFormattedDate = () => {
        if (!selectedDateId || !weatherDates) return null;
        const date = weatherDates.find(d => d._id == selectedDateId);
        if (!date) return null;
        return <span>{dayjs(date.date).tz("Europe/Lisbon").format(date.format)}</span>
    }
    
    return (
        <div className="date-indicator">
            { getFormattedDate() }
        </div>
    )
}

export default DateIndicator;