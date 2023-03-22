import 'leaflet/dist/leaflet.css';
import {Col, Container, Row, Spinner, Toast, ToastContainer} from "react-bootstrap";
import Map from "./Map/map/map.component";
import WeatherPanelStore from '../stores/WeatherPanelStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faObjectGroup, faHandPointer } from '@fortawesome/free-solid-svg-icons'
import NavigationBar from './Navbar/navigation-bar/navigation-bar.component';
import "../styles/Index.css";

function App(): JSX.Element {
    const loading = WeatherPanelStore(state => state.loading);
    //const comparisonMode = WeatherPanelStore(state => state.comparisonMode);
    const selectMode = WeatherPanelStore(state => state.selectMode);
    const selectAreaMode = WeatherPanelStore(state => state.selectAreaMode);

    const isTabOpen = WeatherPanelStore(state => state.isTabOpen);

    return (
        <Container fluid>
            <NavigationBar />

            <Row>
                <Col xs={12} style={{margin: 0, padding: 0}}>
                    <Map/>
                </Col>
            </Row>

            <ToastContainer style={{zIndex:999}} id="toastContainer" className={isTabOpen ? 'start-33' : ''} position="bottom-center">
                <Toast bg="dark" show={loading} animation={true}>
                    <Toast.Body className='text-white'>
                        <Spinner size="sm" animation="border" role="status" /> A carregar...
                    </Toast.Body>
                </Toast> 

                {/* <Toast bg="dark" show={comparisonMode} animation={true}>
                    <Toast.Body className='text-white'>Clique nas localidades para adicionar à lista</Toast.Body>
                </Toast>  */}
                
                <Toast bg="dark" show={(selectMode && !loading) ? true : false} animation={true}>
                    <Toast.Body className='text-white'> 
                    {
                        //selectMode === 'area' && 
                        selectAreaMode &&
                        <span><FontAwesomeIcon icon={faObjectGroup} />  Clique e arraste para selecionar uma área</span>
                    } 
                    {
                        //selectMode === 'individual' && 
                        !selectAreaMode &&
                        <span>
                            <FontAwesomeIcon icon={faHandPointer} />  Clique nas localidades para adicionar à lista
                        </span>
                    }  
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    )
}

export default App;