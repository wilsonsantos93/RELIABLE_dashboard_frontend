import React from 'react';
import {PanelProperties} from "../../models/PanelProperties";
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/WeatherPanel.css';
import {Col, Row} from "react-bootstrap";


function WeatherDateSelector(props: PanelProperties): JSX.Element {

    return (
        <Row>
            <Col><Form.Text>Weather date</Form.Text></Col>
            <Col>
                <Form.Select className="WeatherInfoSelector" onChange={(event) => {
                    props.setSelectedInfo(event.target.value as "Temperature" | "WindSpeed" | undefined)
                }}>
                    <option value={undefined}> No selected</option>
                    <option value={"Temperature"}>Temperature</option>
                    <option value={"WindSpeed"}> Wind Speed</option>
                </Form.Select>
            </Col>
        </Row>
    )
}

export default WeatherDateSelector;
