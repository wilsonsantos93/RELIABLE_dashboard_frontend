import React, {useState} from 'react';
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css'
import '../styles/WeatherPanel.css'
import {Col, Row} from "react-bootstrap";
import Map from "../components/Map"
import WeatherPanel from "./WeatherPanel/WeatherPanel";

function App(): JSX.Element {

    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedInfo, setSelectedInfo] = useState<"Temperature" | "WindSpeed">();

    return (
        <div>

            <Row style={{margin:0, padding:0}}>
                <Col xs={8} style={{margin:0, padding:0}}>
                    <Map
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedInfo={selectedInfo}
                        setSelectedInfo={setSelectedInfo}
                    />
                </Col>

                <Col style={{margin:0, padding:0}}>
                    <WeatherPanel
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedInfo={selectedInfo}
                        setSelectedInfo={setSelectedInfo}
                    />
                </Col>
            </Row>
        </div>


    )


}

export default App;

