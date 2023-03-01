import { ChangeEvent, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/WeatherPanel.css';
import {Col, Row} from "react-bootstrap";
import WeatherPanelStore from "../../stores/WeatherPanelStore";


function WeatherInfoSelector(): JSX.Element {

    const setSelectedInformation = WeatherPanelStore(state => state.setSelectedInformation);
    const selectedWeatherField = WeatherPanelStore(state => state.selectedInformation);

    const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedInformation(event.target.value as "Temperature" | "WindSpeed" | undefined);
    }

    useEffect( () => {
        setSelectedInformation("Temperature");
    }, []);

    //TODO: Get weather metadata 

    return (
        <Row style={{margin: 0, padding: 0}}>
            <Col style={{margin: 0, padding: 0}}><Form.Text>Weather information</Form.Text></Col>
            <Col style={{margin: 0, padding: 0}}>
                <Form.Select value={selectedWeatherField} onChange={onSelectChange}>
                    <option value="">No weather information selected</option>
                    <option value="Temperature">Temperature</option>
                    <option value="WindSpeed">Wind Speed</option>
                </Form.Select>
            </Col>
        </Row>
    )
}

export default WeatherInfoSelector;
