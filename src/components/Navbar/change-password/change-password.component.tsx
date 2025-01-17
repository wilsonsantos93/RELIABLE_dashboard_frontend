import { useState } from 'react';
import { Alert, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { changePassword } from '../../../store/user/user.action';
import "./change-password.styles.css";

type ChangePasswordProps = {
    show: boolean
    handleClose: () => void
}

const ChangePassword = ({ show, handleClose }: ChangePasswordProps) => {
  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [error, setError] = useState<string | null>();
  const dispatch = useDispatch<any>();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    try {
        if (!password || !confirmPassword) throw "Campos em falta.";
        const data = { password, confirmPassword };
        dispatch(changePassword(data)).then(() =>  { 
            handleClose();
        }).catch((error: string) => {
            if (error === "UNAUTHORIZED") handleClose();
        })
        .catch((error: any) => {
            setError(JSON.stringify(error))
        });;
    } catch (error: any) {
        setError(JSON.stringify(error));
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title className="update-password-form-header">Alterar palavra-passe</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {   error &&
                <Alert key="danger" variant="danger"> 
                    {error}
                </Alert>
            }
            <Form noValidate validated={validated} onSubmit={handleSubmit}>

                <Form.Group className="mb-3" controlId="validationCustomPassword">
                    <Form.Label className="signup-form-label">Nova palavra-passe</Form.Label>
                    <Form.Control onChange={(e:any) => setPassword(e.target.value)} minLength={6} type="password" placeholder="Insira a palavra-passe" required />
                    <Form.Control.Feedback type="invalid">
                        Palavra-passe deve ter pelo menos 6 caracteres.
                    </Form.Control.Feedback> 
                </Form.Group>

                <Form.Group className="mb-3" controlId="validationCustomPasswordConfirm">
                    <Form.Label className="signup-form-label">Confirmar nova palavra-passe</Form.Label>
                    <Form.Control 
                        onChange={(e:any) => setConfirmPassword(e.target.value)} 
                        /* isInvalid={(confirmPassword as string != password as string)}  */
                        type="password" 
                        minLength={6}
                        placeholder="Repita a palavra-passe" 
                        required 
                    />
                    <Form.Control.Feedback type="invalid">
                        Palavra-passe deve ter pelo menos 6 caracteres.
                        {/* A palavra-passe não coincide. */}
                    </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid gap-2">
                    <Button disabled={!password || !confirmPassword || !password.length || !confirmPassword.length} variant="primary" type="submit">
                        Confirmar
                    </Button>
                </div>
                {/* <Button className="signup-form-btn" disabled={!password || !confirmPassword || !password.length || !confirmPassword.length} type="submit">Confirmar</Button> */}
            </Form>
        </Modal.Body>
    </Modal>
  );
}

export default ChangePassword;