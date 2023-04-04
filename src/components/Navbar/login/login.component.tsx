import { useState } from 'react';
import { Alert, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../store/user/user.action';
import "./login.styles.css";

type LoginProps = {
    show: boolean,
    handleClose: () => void
}

const Login = ({ show, handleClose }: LoginProps) => {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [error, setError] = useState<string>();

    const dispatch = useDispatch<any>();

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            if (!email || !password) throw "Campos em falta.";
            const credentials = { username: email, password };
            dispatch(loginUser(credentials)).then(() =>  { 
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
        <Modal show={show} onHide={handleClose} >
            <Modal.Header closeButton>
                <Modal.Title className="login-form-header">Login utilizador</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {   error &&
                    <Alert key="danger" variant="danger"> 
                        {error}
                    </Alert>
                }
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="login-form-label">Endereço e-mail:</Form.Label>
                        <Form.Control className="login-form-input" onChange={e => setEmail(e.target.value)} required type="email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className="login-form-label">Palavra-passe:</Form.Label>
                        <Form.Control className="login-form-input" onChange={e => setPassword(e.target.value)} required minLength={6} type="password" />
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <Button className="login-form-btn" variant="primary" type="submit">
                            Entrar
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
        </>
    );
}

export default Login;