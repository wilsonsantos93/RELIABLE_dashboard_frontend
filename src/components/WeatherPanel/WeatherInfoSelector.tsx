import React from 'react';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/WeatherPanel.css';
import {Col, Row} from "react-bootstrap";
import WeatherPanelStore from "../../stores/WeatherPanelStore";


function WeatherInfoSelector(): JSX.Element {

    const setSelectedInformation = WeatherPanelStore(state => state.setSelectedInformation)

    return (
        <Row style={{margin:0, padding:0}}>
            <Col style={{margin:0, padding:0}}><Form.Text>Weather information</Form.Text></Col>
            <Col style={{margin:0, padding:0}}>
                <Form.Select onChange={(event) => {
                    setSelectedInformation(event.target.value as "Temperature" | "WindSpeed" | undefined)
                }}>
                    <option value={undefined}>
                        No weather information selected
                    </option>
                    <option value={"Temperature"}>Temperature</option>
                    <option value={"WindSpeed"}>Wind Speed</option>
                </Form.Select>
            </Col>
        </Row>
    )
}

export default WeatherInfoSelector;
