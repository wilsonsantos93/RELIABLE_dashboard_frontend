import { Navbar, Container, Nav } from "react-bootstrap";

const NavigationBar = () => {

    return (
        <Navbar bg="dark" fixed="top" variant="dark">
            <Container fluid>
                <Navbar.Brand href="#home">RELIABLE</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="#">Contactos</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link href="#">Entrar</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;