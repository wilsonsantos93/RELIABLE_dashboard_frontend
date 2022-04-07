import React from 'react';
import {WeatherInfoSelectorProperties} from "../../models/WeatherPanel";
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/WeatherPanel.css';
import {Col, Row} from "react-bootstrap";


function WeatherInfoSelector(props: WeatherInfoSelectorProperties): JSX.Element {

    return (
        <Row>
            <Col><Form.Text>Weather information</Form.Text></Col>
            <Col>
                <Form.Select onChange={(event) => {
                    props.setSelectedInfo(event.target.value as "Temperature" | "WindSpeed" | undefined)
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
