import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

type ContactsProps = {
    show: boolean,
    handleClose: () => void
}

const Contacts = ({ show, handleClose }: ContactsProps) => {
  /* const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true); */

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Contactos</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "left" }}>
            Woohoo, you're reading this text in a modal!
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