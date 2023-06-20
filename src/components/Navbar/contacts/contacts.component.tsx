import { Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./contacts.styles.css";

type ContactsProps = {
    show: boolean,
    handleClose: () => void
}

const Contacts = ({ show, handleClose }: ContactsProps) => {

  return (
    <>
      <Modal id="contactsModal" show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Sobre o projeto</Modal.Title>
        </Modal.Header>
        <Modal.Body> 
          <p>Projeto financiado por:</p>
          <Container style={{ textAlign: 'center' }}>
            <Row>
              <Col>
                <a target="_blank" href="https://www.fct.pt/"><img src="/logos/FCT.png"/></a>
                <span>DSAIPA/DS/0111/2019</span>
              </Col>
            </Row>
          </Container>

          <p>Parceiros:</p>
          <Container>
            <Row>
              <Col lg="3" xs="6"><a target="_blank" href="http://in3.dem.ist.utl.pt/"><img src="/logos/IN+.jpg"/></a></Col>
              <Col lg="3" xs="6"><a target="_blank" href="http://welcome.isr.tecnico.ulisboa.pt/"><img src="/logos/isr.png"/></a></Col>
              <Col lg="3" xs="6"><a target="_blank" href="http://www.maretec.org/"><img src="/logos/maretec.png"/></a></Col>
              <Col lg="3" xs="6"><a target="_blank" href="https://iti.larsys.pt//"><img src="/logos/ITI.png"/></a></Col>
            </Row>
            <Row>
              <Col lg="3" xs="6"><a target="_blank" href="https://www.tecnico.ulisboa.pt/"><img src="/logos/IST.png"/></a></Col>
              <Col lg="3" xs="6"><a target="_blank" href="http://www.insa.min-saude.pt/"><img src="/logos/insa.png"/></a></Col>
              <Col lg="3" xs="6"><a target="_blank" href="https://www.adene.pt/"><img src="/logos/adene.png"/></a></Col>
              <Col lg="3" xs="6"><a target="_blank" href="https://www.sns.gov.pt/entidades-de-saude/agrupamento-de-centros-de-tras-os-montes-alto-tamega-e-barroso/"><img src="/logos/aces_atb.png"/></a></Col>
            </Row>
          </Container>

          <p style={{ marginTop: "30px" }}>Mais informações <a href="https://reliable.tecnico.ulisboa.pt/">aqui</a>.</p>

        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Fechar
            </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Contacts;