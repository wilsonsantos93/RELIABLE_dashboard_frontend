import React from 'react';
import {PanelProperties} from "../../models/PanelProperties";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/WeatherPanel.css';
import {Stack} from "react-bootstrap";
import WeatherInfoSelector from "./WeatherInfoSelector";
import WeatherDateSelector from "./WeatherDateSelector";

function WeatherPanel(props: PanelProperties): JSX.Element {

    return (

        <div className="WeatherPanel">

            <Stack>

                <WeatherInfoSelector setSelectedInfo={props.setSelectedInfo}/>

                <WeatherDateSelector setSelectedDate={props.setSelectedDate} setSelectedInfo={props.setSelectedInfo}/>

            </Stack>

        </div>

    );

}

export default WeatherPanel;

