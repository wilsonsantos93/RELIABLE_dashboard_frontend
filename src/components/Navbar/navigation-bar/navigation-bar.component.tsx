import { useState } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import Contacts from "../contacts/contacts.component";
import Login from "../login/login.component";
import Register from "../register/register.component";

const NavigationBar = () => {
    const [showContacts, setShowContacts] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

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

    return (
        <>
        <Navbar bg="dark" fixed="top" variant="dark">
            <Container fluid>
                <Navbar.Brand href="#home">RELIABLE</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link onClick={() => handleShowContacts()} href="#">Contactos</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link onClick={() => handleShowRegister()} href="#">Registar</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link onClick={() => handleShowLogin()} href="#">Entrar</Nav.Link>
                </Nav>
            </Container>
        </Navbar>

        <Contacts show={showContacts} handleClose={() => closeContacts()} />
        { showLogin && <Login show={showLogin} handleClose={() => closeLogin()} /> }
        { showRegister && <Register show={showRegister} handleClose={() => closeRegister()} /> }
        </>
    );
}

export default NavigationBar;