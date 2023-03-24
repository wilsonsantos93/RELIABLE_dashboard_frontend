import { useState } from 'react';
import { Alert, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';

const registerUser = async (data: any) => {
    try {
        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response?.ok) {
            if (response.status == 401) throw "Não autorizado.";
            if (response.status > 401) throw "Ocorreu um erro.";
        }

        const user = await response.json();
        return user;
    } catch (e) {
        throw e;
    }
}


type RegisterProps = {
    show: boolean
    handleClose: () => void
}

const Register = ({ show, handleClose }: RegisterProps) => {
  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [error, setError] = useState<string>();

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    const data = { email, password, confirmPassword };

  };

  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Criar conta utilizador</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {   error &&
                <Alert key="danger" variant="danger"> 
                    {error}
                </Alert>
            }
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="validationCustomEmail">
                        <Form.Label>Endereço e-mail</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                aria-describedby="inputGroupPrepend"
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Insira um e-mail.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="validationCustomPassword">
                        <Form.Label>Palavra-passe</Form.Label>
                        <Form.Control onChange={e => setPassword(e.target.value)} minLength={6} type="password" placeholder="Palavra-passe" required />
                        <Form.Control.Feedback type="invalid">
                            Palavra-passe deve ter pelo menos 6 caracteres.
                        </Form.Control.Feedback> 
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationCustomPasswordConfirm">
                        <Form.Label>Confirmar palavra-passe</Form.Label>
                        <Form.Control 
                            onChange={e => setConfirmPassword(e.target.value)} 
                            isInvalid={(confirmPassword as string != password as string)} 
                            type="password" 
                            placeholder="Repita a palavra-passe" 
                            required 
                        />
                        <Form.Control.Feedback type="invalid">
                           A palavra-passe não coincide.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Button type="submit">Registar</Button>
            </Form>
        </Modal.Body>
    </Modal>
  );
}

export default Register;