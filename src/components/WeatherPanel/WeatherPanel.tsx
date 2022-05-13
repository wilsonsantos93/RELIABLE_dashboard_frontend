import React from 'react';
import {PanelProperties} from "../../models/WeatherPanelProperties";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/WeatherPanel.css';
import {Stack} from "react-bootstrap";
import WeatherInfoSelector from "./WeatherInfoSelector";
import WeatherDateSelector from "./WeatherDateSelector";

function WeatherPanel(): JSX.Element {

    return (

        <div className="WeatherPanel">

            <Stack>

                <WeatherInfoSelector/>

                <WeatherDateSelector/>

            </Stack>

        </div>

    );

}

export default WeatherPanel;

