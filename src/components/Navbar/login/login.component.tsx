import { useState } from 'react';
import { Alert, Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UserMarkerStore from '../../../stores/UserMarkerStore';
import UserStore from '../../../stores/UserStore';

const loginUser = async (credentials: any) => {
    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
       
        if (!response?.ok) {
            if (response.status == 401) throw "Credenciais incorretas.";
            if (response.status > 401) throw "Ocorreu um erro.";
        }
    
        const user = await response.json();
        return user;
    } catch (e) {
        throw e;
    }
}

const Login = ({ show, handleClose }: any) => {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [error, setError] = useState(null);
    const setUser = UserStore(state => state.setUser);
    const setToken = UserStore(state => state.setToken);

    const handleSubmit = async (event: any) => {
        try {
            const data = await loginUser({ username: email, password });
            setUser(data.user);
            setToken(data.jwt);
            handleClose();
        } catch (e: any) {
            setError(e);
        }
    };

    return (
        <>
        <Modal show={show} onHide={handleClose} >
            <Modal.Header closeButton>
                <Modal.Title>Entrar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {   error &&
                    <Alert key="danger" variant="danger"> 
                        {error}
                    </Alert>
                }
                <Form /* noValidate validated={validated}  */onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Endereço e-mail:</Form.Label>
                        <Form.Control onChange={e => setEmail(e.target.value)} required type="email" placeholder="Insira o e-mail" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Palavra-passe:</Form.Label>
                        <Form.Control onChange={e => setPassword(e.target.value)} required minLength={6} type="password" placeholder="Insira a palavra-passe" />
                    </Form.Group>

                    <div className="d-grid gap-2">
                        <Button variant="primary" type="submit">
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