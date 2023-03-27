import 'leaflet/dist/leaflet.css';
import {Col, Container, Row, Spinner, Toast, ToastContainer} from "react-bootstrap";
import Map from "./Map/map/map.component";
import WeatherPanelStore from '../stores/WeatherPanelStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faObjectGroup, faHandPointer, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import NavigationBar from './Navbar/navigation-bar/navigation-bar.component';
import "../styles/Index.css";
import { useDispatch, useSelector } from 'react-redux';
import { selectAreaMode, selectErrorMsg, selectInfoMsg, selectIsSidebarOpen, selectLoading, selectSuccessMsg } from '../store/settings/settings.selector';
import { useEffect } from 'react';
import fetchIntercept from 'fetch-intercept';
import { signOutSuccess } from '../store/user/user.action';
import { setErrorMsg, setInfoMsg, setSuccessMsg, showErrorMsg, showInfoMsg, showSuccessMsg } from '../store/settings/settings.action';

function App(): JSX.Element {
    //const loading = WeatherPanelStore(state => state.loading);
    const loading = useSelector(selectLoading);
    //const comparisonMode = WeatherPanelStore(state => state.comparisonMode);
    const selectMode = WeatherPanelStore(state => state.selectMode);
    //const selectAreaMode = WeatherPanelStore(state => state.selectAreaMode);
    const areaMode = useSelector(selectAreaMode);
    //const isTabOpen = WeatherPanelStore(state => state.isTabOpen);
    const isSidebarOpen = useSelector(selectIsSidebarOpen);
    const infoMsg = useSelector(selectInfoMsg);
    const successMsg = useSelector(selectSuccessMsg);
    const errorMsg = useSelector(selectErrorMsg);
    const dispatch = useDispatch<any>();

    useEffect(() => {
        const unregister = fetchIntercept.register({
            response: function (response) {
                if (!response.ok && response.status === 401) {
                    dispatch(signOutSuccess());
                    dispatch(showInfoMsg("Sessão expirada. Entre novamente."));
                }
                return response;
            },
        });
        return () => unregister();
    }, [])

    return (
        <Container fluid>
            <NavigationBar />

            <Row>
                <Col xs={12} style={{margin: 0, padding: 0}}>
                    <Map/>
                </Col>
            </Row>

            <ToastContainer style={{zIndex:9999}} position="top-center">
                <Toast onClose={() => dispatch(showInfoMsg(null))} bg="primary" show={Boolean(infoMsg)} animation={true} delay={2000} autohide>
                    <Toast.Body className='text-white'>
                        <FontAwesomeIcon icon={faCircleInfo} ></FontAwesomeIcon> { infoMsg }
                    </Toast.Body>
                </Toast> 
                <Toast onClose={() => dispatch(showSuccessMsg(null))} bg="success" show={Boolean(successMsg)} animation={true} delay={2000} autohide>
                    <Toast.Body className='text-white'>
                        { infoMsg }
                    </Toast.Body>
                </Toast>
                <Toast onClose={() => dispatch(showErrorMsg(null))} bg="danger" show={Boolean(errorMsg)} animation={true} delay={2000} autohide>
                    <Toast.Body className='text-white'>
                        { infoMsg }
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <ToastContainer style={{zIndex:999}} id="toastContainer" className={isSidebarOpen ? 'start-33' : ''} position="bottom-center">
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
                        areaMode &&
                        <span><FontAwesomeIcon icon={faObjectGroup} />  Clique e arraste para selecionar uma área</span>
                    } 
                    {
                        //selectMode === 'individual' && 
                        !areaMode &&
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