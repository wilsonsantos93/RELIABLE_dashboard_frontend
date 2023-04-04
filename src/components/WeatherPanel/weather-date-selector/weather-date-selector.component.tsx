import {ChangeEvent, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Row} from "react-bootstrap";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedDateId, selectWeatherDates } from '../../../store/settings/settings.selector';
import { getWeatherDates, setDateId } from '../../../store/settings/settings.action';
dayjs.extend(utc);
dayjs.extend(timezone);
const tz = "Europe/Lisbon";

function WeatherDateSelector(): JSX.Element {
    const selectedDateDatabaseId = useSelector(selectSelectedDateId);
    const weatherDates = useSelector(selectWeatherDates);
    const dispatch = useDispatch<any>();

    useEffect(() => {
        dispatch(getWeatherDates());
    }, []);

    const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        dispatch(setDateId(event.target.value))
    }

    return (
        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>
                Selecionar data:
            </Form.Label>
            <Col sm={8}>
            <Form.Select style={{fontSize: "unset"}} value={selectedDateDatabaseId ? selectedDateDatabaseId : ''} onChange={onSelectChange}>
                <option key="none_opt_date" value="">Sem data selecionada</option>
                { 
                    weatherDates?.map(date => 
                    <option key={date._id} value={date._id}>
                        {dayjs((date.date as Date).toISOString()).tz(tz).format(date.format)}
                    </option>)
                }
            </Form.Select>
            </Col>
        </Form.Group>
    )
}

export default WeatherDateSelector;
