import 'leaflet/dist/leaflet.css';
import '../styles/Map.css'
import '../styles/WeatherPanel.css'
import {Col, Row} from "react-bootstrap";
import Map from "./Map/Map"
import WeatherPanel from "./WeatherPanel/WeatherPanel";

function App(): JSX.Element {
    return (
        <div>
            <Row style={{margin: 0, padding: 0}}>
                <Col xs={8} style={{margin: 0, padding: 0}}>
                    <Map/>
                    {/* <MyMap /> */}
                </Col>

                <Col style={{margin: 0, padding: 0}}>
                    <WeatherPanel/>
                </Col>
            </Row>
        </div>
    )
}

export default App;