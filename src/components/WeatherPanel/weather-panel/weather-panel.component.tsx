import { Stack } from "react-bootstrap";
import WeatherInfoSelector from "../weather-info-selector/weather-info-selector.component";
import WeatherDateSelector from "../weather-date-selector/weather-date-selector.component";
import './weather-panel.styles.css';

const WeatherPanel = () => {
    return (
        <div className="weather-panel">
            <Stack>
                <WeatherInfoSelector/>
                <WeatherDateSelector/>
            </Stack>
        </div>
    );
}

export default WeatherPanel;

