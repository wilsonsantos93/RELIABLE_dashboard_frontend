import 'leaflet/dist/leaflet.css';
import '../styles/Map.css'
import '../styles/WeatherPanel.css'
import {Col, Row, Spinner, Toast, ToastContainer} from "react-bootstrap";
import Map from "./Map/Map"
import WeatherPanel from "./WeatherPanel/WeatherPanel";
import WeatherPanelStore from '../stores/WeatherPanelStore';

function App(): JSX.Element {
    const loading = WeatherPanelStore(state => state.loading);
    const comparisonMode = WeatherPanelStore(state => state.comparisonMode);

    return (
        <div>
            <Row style={{margin: 0, padding: 0}}>
                <Col xs={12} style={{margin: 0, padding: 0}}>
                    <Map/>
                </Col>

                <Col style={{margin: 0, padding: 0, visibility: 'hidden'}}>
                    <WeatherPanel/>
                </Col>
            </Row>

            <ToastContainer style={{zIndex:999}} position="bottom-center">
                <Toast show={loading} animation={true}>
                    <Toast.Body><Spinner size="sm" animation="border" role="status" /> A carregar...</Toast.Body>
                </Toast> 
                <Toast show={comparisonMode} animation={true}>
                    <Toast.Body>Clique nas localidades para adicionar à lista</Toast.Body>
                </Toast> 
            </ToastContainer>
        </div>
    )
}

export default App;