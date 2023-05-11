import 'leaflet/dist/leaflet.css';
import {Col, Container, Row, Spinner, Toast, ToastContainer} from "react-bootstrap";
import Map from "./Map/map/map.component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faObjectGroup, faHandPointer, faCircleInfo, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import NavigationBar from './Navbar/navigation-bar/navigation-bar.component';
import { useDispatch, useSelector } from 'react-redux';
import { selectAreaMode, selectErrorMsg, selectInfoMsg, selectIsSidebarOpen, selectLoading, selectSuccessMsg } from '../store/settings/settings.selector';
import { useEffect } from 'react';
import fetchIntercept from 'fetch-intercept';
import { getWeatherAlerts, signOut } from '../store/user/user.action';
import { getRegionPathName, showErrorMsg, showInfoMsg, showSuccessMsg } from '../store/settings/settings.action';
import { selectFeature } from '../store/map/map.action';
import { selectSidebarRef } from '../store/refs/refs.selector';
import { selectUserIsLoggedIn } from '../store/user/user.selector';
import "./App.css";

function App(): JSX.Element {
    const loading = useSelector(selectLoading);
    const areaMode = useSelector(selectAreaMode);
    const isSidebarOpen = useSelector(selectIsSidebarOpen);
    const infoMsg = useSelector(selectInfoMsg);
    const successMsg = useSelector(selectSuccessMsg);
    const errorMsg = useSelector(selectErrorMsg);
    const sidebarRef = useSelector(selectSidebarRef);
    const isLoggedIn = useSelector(selectUserIsLoggedIn);
    const dispatch = useDispatch<any>();

    useEffect(() => {
        const unregister = fetchIntercept.register({
            response: function (response) {
                if (!response.ok && response.status === 401) {
                    dispatch(signOut());
                    dispatch(showInfoMsg("Sessão expirada. Entre novamente."));
                    dispatch(selectFeature(null));
                    sidebarRef?.current.close();
                }
                return response;
            },
        });
        return () => unregister();
    }, [sidebarRef])

    useEffect(() => {
        dispatch(getRegionPathName());
        if (isLoggedIn) dispatch(getWeatherAlerts());
    }, [])

    return (
        <Container fluid>
            <NavigationBar />

            <Row>
                <Col xs={12} style={{margin: 0, padding: 0}}>
                    <Map/>
                </Col>
            </Row>

            <ToastContainer className="toast-container" position="top-center">
                <Toast onClose={() => dispatch(showInfoMsg(null))} bg="primary" show={Boolean(infoMsg)} animation={true} delay={2000} autohide>
                    <Toast.Body className='text-white'>
                        <FontAwesomeIcon icon={faCircleInfo} ></FontAwesomeIcon> { infoMsg }
                    </Toast.Body>
                </Toast> 
                <Toast onClose={() => dispatch(showSuccessMsg(null))} bg="success" show={Boolean(successMsg)} animation={true} delay={2000} autohide>
                    <Toast.Body className='text-white'>
                        <FontAwesomeIcon icon={faCheck} ></FontAwesomeIcon> { successMsg }
                    </Toast.Body>
                </Toast>
                <Toast onClose={() => dispatch(showErrorMsg(null))} bg="danger" show={Boolean(errorMsg)} animation={true} delay={2000} autohide>
                    <Toast.Body className='text-white'>
                        <FontAwesomeIcon icon={faXmark} ></FontAwesomeIcon> { errorMsg }
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            { !isSidebarOpen ?
                <ToastContainer style={{textAlign: "center", zIndex:999}} className={`${isSidebarOpen ? 'start-33' : ''} toast-container`} position="bottom-center">
                    <Toast id="loadingToast" bg="dark" show={loading} animation={true}>
                        <Toast.Body className='text-white'>
                            <Spinner size="sm" animation="border" role="status" /> A carregar...
                        </Toast.Body>
                    </Toast> 
        
                    
                    <Toast id="tipToast" bg="dark" show={(!loading) ? true : false} animation={true}>
                        <Toast.Body className='text-white'> 
                        {
                            areaMode &&
                            <span><FontAwesomeIcon icon={faObjectGroup} /> Clique e arraste para selecionar uma área</span>
                        } 
                        {
                            !areaMode &&
                            <span>
                                <FontAwesomeIcon icon={faHandPointer} /> Clique nas localidades para adicionar à tabela
                            </span>
                        }  
                        </Toast.Body>
                    </Toast>
                </ToastContainer> : null
            }
        </Container>
    )
}

export default App;