import React from 'react';
import {PanelProperties} from "../../models/WeatherPanelProperties";
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/WeatherPanel.css';
import {Col, Row} from "react-bootstrap";


function WeatherDateSelector(props: PanelProperties): JSX.Element {

    return (
        <Row style={{margin:0, padding:0}}>
            <Col style={{margin:0, padding:0}}><Form.Text>Weather date</Form.Text></Col>
            <Col style={{margin:0, padding:0}}>
                <Form.Select onChange={(event) => {
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
