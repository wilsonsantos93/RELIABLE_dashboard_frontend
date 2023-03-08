import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/WeatherPanel.css';
import {Stack} from "react-bootstrap";
import WeatherInfoSelector from "./weather-info-selector/weather-info-selector.component";
import WeatherDateSelector from "./weather-date-selector/weather-date-selector.component";

const WeatherPanel = () => {
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

