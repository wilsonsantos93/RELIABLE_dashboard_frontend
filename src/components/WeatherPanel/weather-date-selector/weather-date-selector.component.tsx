import {ChangeEvent, useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/WeatherPanel.css';
import {Col, Row} from "react-bootstrap";
import WeatherPanelStore from "../../../stores/WeatherPanelStore";
import {fetchWeatherDates} from "../../../data/fetchWeatherDates";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
const tz = "Europe/Lisbon";

function WeatherDateSelector(): JSX.Element {
    type WeatherDate = {
        date: Date,
        _id: string
    }[] | undefined;

    const setSelectedDateDatabaseId = WeatherPanelStore(state => state.setSelectedDateDatabaseId);
    const selectedDateDatabaseId = WeatherPanelStore(state => state.selectedDateDatabaseId);

    const [weatherDates, setWeatherDates] = useState<WeatherDate>();

    useEffect(() => {
        if (!weatherDates) {
            (async () => {
                const dates = await fetchWeatherDates();
                setWeatherDates(dates);
                const firstDate = dates.find(d => d.date.valueOf() <= new Date().valueOf())
                if (firstDate) setSelectedDateDatabaseId(firstDate?._id);
            })()
        }
    }, []);

    const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedDateDatabaseId(event.target.value as string | undefined);
    }

    return (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>
                Selecionar data:
            </Form.Label>
            <Col sm={8}>
            <Form.Select style={{fontSize: "unset"}} value={selectedDateDatabaseId} onChange={onSelectChange}>
                <option key="none_opt_date" value="">Sem data selecionada</option>
                { 
                    weatherDates?.map(date => 
                    <option key={date._id} value={date._id}>
                        {dayjs(date.date.toISOString()).tz(tz).format("YYYY-MM-DD HH:mm")}
                    </option>)
                }
            </Form.Select>
            </Col>
        </Form.Group>
    )
}

export default WeatherDateSelector;
