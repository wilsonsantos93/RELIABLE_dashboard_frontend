import { useSelector } from "react-redux";
import { selectLoading, selectSelectedDateId, selectSelectedWeatherField, selectWeatherDates } from "../../../store/settings/settings.selector";
import "./date-indicator.styles.css";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { setDateId } from "../../../store/settings/settings.action";
import { useDispatch } from "react-redux";
dayjs.extend(timezone);
dayjs.extend(utc);

const DateIndicator = () => {
    const selectedDateId = useSelector(selectSelectedDateId);
    const weatherDates = useSelector(selectWeatherDates);
    const selectedWeatherField = useSelector(selectSelectedWeatherField);
    const dispatch = useDispatch<any>();
    const loading = useSelector(selectLoading);

    const getFormattedDate = () => {
        if (!selectedDateId || !weatherDates) return null;
        const date = weatherDates.find(d => d._id == selectedDateId);
        if (!date) return null;

        const containsHours = date.format.includes(":") ? true : false;

        return <span>{dayjs(date.date).tz("Europe/Lisbon").format(`D MMMM YYYY ${containsHours ? "HH:mm" : ''}` )}</span>
        //return <span>{dayjs(date.date).tz("Europe/Lisbon").format(date.format)}</span>
    }

    const prev = () => {
        let previousIx: number;
        const ix = weatherDates.findIndex(f => f._id == selectedDateId);
        if (ix < 0) return;
        if (ix == 0) previousIx = weatherDates.length-1;
        else previousIx = ix - 1;
        dispatch(setDateId(weatherDates[previousIx]._id));
    }

    const next = () => {
        let nextIx: number;
        const ix = weatherDates.findIndex(f => f._id == selectedDateId);
        if (ix < 0) return;
        if (ix == weatherDates.length-1) nextIx = 0;
        else nextIx = ix + 1;
        dispatch(setDateId(weatherDates[nextIx]._id));
    }
    
    return (
        <>
        { weatherDates && weatherDates.length && selectedDateId ?
            <div className="date-indicator">
                <Button disabled={loading} title="Data anterior" variant="light" onClick={() => prev() } size="sm"><FontAwesomeIcon icon={faArrowLeft} /></Button>
                <span>{ selectedWeatherField?.displayName } <span className="d-none d-sm-inline">referente a</span> { getFormattedDate() }</span>
                <Button disabled={loading} title="Data seguinte" variant="light" onClick={() => next() } size="sm"><FontAwesomeIcon icon={faArrowRight} /></Button>
            </div> : null
        }
        </>
    )
}

export default DateIndicator;