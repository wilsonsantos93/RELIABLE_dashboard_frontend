import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setInfoMsg } from "../../../store/settings/settings.action";
import { signOutSuccess } from "../../../store/user/user.action";
import { selectUser, selectUserIsLoggedIn } from "../../../store/user/user.selector";
import UserStore from "../../../stores/UserStore";
import Contacts from "../contacts/contacts.component";
import Login from "../login/login.component";
import Register from "../register/register.component";

const NavigationBar = () => {
    const [showContacts, setShowContacts] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    /*const isLoggedIn = UserStore(state => state.isLoggedIn());
     const user = UserStore(state => state.user);
    const setUser = UserStore(state => state.setUser); 
    const setToken = UserStore(state => state.setToken);*/
    
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

    const logout = () => {
       /*  setUser(null);
        setToken(null); */
        dispatch(signOutSuccess());
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
                    <Nav.Link onClick={() => handleShowContacts()} href="#">Contactos</Nav.Link>
                </Nav>
              
                {  !isLoggedIn ?  
                    <>
                    <Nav>
                        <Nav.Link onClick={() => handleShowRegister()} href="#">Registar</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link onClick={() => handleShowLogin()} href="#">Entrar</Nav.Link>
                    </Nav>
                    </> : 

                    <NavDropdown align="end" title={titleComponent} id="basic-nav-dropdown">
                        <NavDropdown.Item href="#">Alterar palavra-passe</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={logout} href="#">
                           Sair
                        </NavDropdown.Item>
                    </NavDropdown>
                    
                }
                
            </Container>
        </Navbar>

        <Contacts show={showContacts} handleClose={() => closeContacts()} />
        { showLogin && <Login show={showLogin} handleClose={() => closeLogin()} /> }
        { showRegister && <Register show={showRegister} handleClose={() => closeRegister()} /> }
        </>
    );
}

export default NavigationBar;