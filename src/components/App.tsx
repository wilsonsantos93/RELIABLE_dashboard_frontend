import 'leaflet/dist/leaflet.css';
import {Col, Row, Spinner, Toast, ToastContainer} from "react-bootstrap";
import Map from "./Map/map/map.component";
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
            </Row>

            <ToastContainer style={{zIndex:999}} position="bottom-center">
                <Toast bg="dark" show={loading} animation={true}>
                    <Toast.Body className='text-white'>
                        <Spinner size="sm" animation="border" role="status" /> A carregar...
                    </Toast.Body>
                </Toast> 

                <Toast bg="dark" show={comparisonMode} animation={true}>
                    <Toast.Body className='text-white'>Clique nas localidades para adicionar à lista</Toast.Body>
                </Toast> 
            </ToastContainer>
        </div>
    )
}

export default App;