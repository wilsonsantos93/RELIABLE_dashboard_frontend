import 'leaflet/dist/leaflet.css';
import {Col, Row, Spinner, Toast, ToastContainer} from "react-bootstrap";
import Map from "./Map/map/map.component";
import WeatherPanelStore from '../stores/WeatherPanelStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faObjectGroup, faHandPointer } from '@fortawesome/free-solid-svg-icons'

function App(): JSX.Element {
    const loading = WeatherPanelStore(state => state.loading);
    const comparisonMode = WeatherPanelStore(state => state.comparisonMode);
    const selectMode = WeatherPanelStore(state => state.selectMode);

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

                {/* <Toast bg="dark" show={comparisonMode} animation={true}>
                    <Toast.Body className='text-white'>Clique nas localidades para adicionar à lista</Toast.Body>
                </Toast>  */}
                <Toast bg="dark" show={selectMode ? true : false} animation={true}>
                    <Toast.Body className='text-white'> 
                    {
                        selectMode === 'area' && 
                        <span><FontAwesomeIcon icon={faObjectGroup} />  Clique e arraste para selecionar uma área</span>
                    } 
                    {
                        selectMode === 'individual' && 
                        <span>
                            <FontAwesomeIcon icon={faHandPointer} />
                            Clique numa localidade para adicionar/remover
                        </span>
                    }  
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    )
}

export default App;