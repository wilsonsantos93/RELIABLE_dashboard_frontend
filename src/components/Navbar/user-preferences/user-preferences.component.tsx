import { useEffect, useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { selectAlertByEmail, selectUser } from '../../../store/user/user.selector';
import { updateUserPreferences } from '../../../store/user/user.action';

type ContactsProps = {
    show: boolean,
    handleClose: () => void
}

const UserPreferences = ({ show, handleClose }: ContactsProps) => {

  const dispatch = useDispatch<any>();
  const [emailSubscription, setEmailSubscription] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const alertByEmail = useSelector(selectAlertByEmail);

  useEffect(() => {
    setEmailSubscription(alertByEmail);
  }, [alertByEmail])
  
  const onSwitchChange = () => {
    setEmailSubscription(!emailSubscription);
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
        const data = { alertByEmail: emailSubscription };
        dispatch(updateUserPreferences(data)).then(() =>  { 
          handleClose();
        })
        .catch((error: any) => {
          setError(JSON.stringify(error))
        });
    } catch (error: any) {
      setError(JSON.stringify(error))
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Preferências</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "left" }}>
          { error &&
            <Alert key="danger" variant="danger"> 
              {error}
            </Alert>
          }

          <Form onSubmit={handleSubmit} style={{ textAlign: 'center'}}>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              {emailSubscription}
              <Form.Check checked={emailSubscription} label="Receber alertas por e-mail" className="login-form-input" onChange={onSwitchChange}  type="switch" />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                Confirmar
              </Button>
            </div>
          </Form>

        </Modal.Body>
      </Modal>
    </>
  );
}

export default UserPreferences;