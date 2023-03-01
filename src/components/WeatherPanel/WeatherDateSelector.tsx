import React, {ChangeEvent, useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/WeatherPanel.css';
import {Col, Row} from "react-bootstrap";
import WeatherPanelStore from "../../stores/WeatherPanelStore";
import {fetchWeatherDates} from "../../data/fetchWeatherDates";


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
        <Row style={{margin: 0, padding: 0}}>
            <Col style={{margin: 0, padding: 0}}><Form.Text>Weather date</Form.Text></Col>
            <Col style={{margin: 0, padding: 0}}>
                <Form.Select value={selectedDateDatabaseId} onChange={onSelectChange}>
                    <option value="">No date selected</option>
                    { 
                        weatherDates?.map(date => <option key={date._id} value={date._id}>{date.date.toDateString()}</option>)
                    }
                </Form.Select>
            </Col>
        </Row>
    )
}

export default WeatherDateSelector;
