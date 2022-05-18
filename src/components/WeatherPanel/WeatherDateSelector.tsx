import React, {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/WeatherPanel.css';
import {Col, Row} from "react-bootstrap";
import WeatherPanelStore from "../../stores/WeatherPanelStore";
import {fetchWeatherDates} from "../../data/fetchWeatherDates";


function WeatherDateSelector(): JSX.Element {

    const setSelectedDateDatabaseId = WeatherPanelStore(state => state.setSelectedDateDatabaseId)

    const [weatherDates, setWeatherDates] = useState<{ date: Date, _id: string }[] | undefined>();
    useEffect(() => {

        if (!weatherDates) {

            (async () => {
                let fetchedWeatherDates = await fetchWeatherDates();
                setWeatherDates(fetchedWeatherDates)
            })()

        }

    }, [])

    let dateOptions = [];
    if (weatherDates) {
        for (const currentWeatherDate of weatherDates) {
            dateOptions.push(
                <option value={currentWeatherDate._id}>{currentWeatherDate.date.toDateString()}</option>
            )
        }
    }


    return (
        <Row style={{margin: 0, padding: 0}}>
            <Col style={{margin: 0, padding: 0}}><Form.Text>Weather date</Form.Text></Col>
            <Col style={{margin: 0, padding: 0}}>
                <Form.Select onChange={(event) => {
                    setSelectedDateDatabaseId(event.target.value as string | undefined)
                }}>
                    <option value="">No date selected</option>
                    {dateOptions}
                </Form.Select>
            </Col>
        </Row>
    )
}

export default WeatherDateSelector;
