import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setInfoMsg } from "../../../store/settings/settings.action";
import { signOut } from "../../../store/user/user.action";
import { selectUser, selectUserIsLoggedIn } from "../../../store/user/user.selector";
import ChangePassword from "../change-password/change-password.component";
import Contacts from "../contacts/contacts.component";
import Login from "../login/login.component";
import Register from "../register/register.component";
import WeatherAlerts from "../weather-alerts/weather-alerts.component";

const NavigationBar = () => {
    const [showContacts, setShowContacts] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showUpdatePassword, setShowUpdatePassword] = useState(false);

    const user = useSelector(selectUser);
    const isLoggedIn = useSelector(selectUserIsLoggedIn);
    const dispatch = useDispatch<any>();

    const handleShowContacts = () => {
        setShowContacts(true);
    }

    const closeContacts = () => {
        setShowContacts(false);
    }

    const handleShowLogin = () => {
        setShowLogin(true);
    }

    const closeLogin = () => {
        setShowLogin(false);
    }

    const handleShowRegister = () => {
        setShowRegister(true);
    }

    const closeRegister = () => {
        setShowRegister(false);
    }

    const handleShowUpdatePassword = () => {
        setShowUpdatePassword(true);
    }

    const closeUpdatePassword = () => {
        setShowUpdatePassword(false);
    }

    const logout = () => {
        dispatch(signOut());
        dispatch(setInfoMsg("Sessão terminada."));
    }

    const titleComponent = <span style={{color: 'white'}}>
        <FontAwesomeIcon icon={faUser} /> {user?.email.split("@")[0]}
    </span>

    return (
        <>
        <Navbar bg="dark" fixed="top" variant="dark" style={{zIndex:2200}}>
            <Container fluid>
                <Navbar.Brand href="#home">RELIABLE</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link id="contactsBtn" onClick={() => handleShowContacts()} href="#">Contactos</Nav.Link>
                </Nav>
              
                {  !isLoggedIn ?  
                    <>
                        <Nav>
                            <Nav.Link id="signUpBtn" onClick={() => handleShowRegister()} href="#">Registar</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link id="signInBtn" onClick={() => handleShowLogin()} href="#">Entrar</Nav.Link>
                        </Nav>
                    </> 
                    : 
                    <>
                        <WeatherAlerts />
                        <NavDropdown align="end" title={titleComponent} id="basic-nav-dropdown">
                            <NavDropdown.Item id="updatePasswordBtn" onClick={() => handleShowUpdatePassword()} href="#">Alterar palavra-passe</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item id="signOutBtn" onClick={logout} href="#">
                            Sair
                            </NavDropdown.Item>
                        </NavDropdown>
                    </>
                }
                
            </Container>
        </Navbar>

        <Contacts show={showContacts} handleClose={() => closeContacts()} />
        { showLogin && <Login show={showLogin} handleClose={() => closeLogin()} /> }
        { showRegister && <Register show={showRegister} handleClose={() => closeRegister()} /> }
        { showUpdatePassword && <ChangePassword show={showUpdatePassword} handleClose={() => closeUpdatePassword()} /> }
        </>
    );
}

export default NavigationBar;