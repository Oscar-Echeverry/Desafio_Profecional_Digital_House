import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario } from '../services/api';
import { Form, Button, Card, Alert } from 'react-bootstrap';

function Login({ setToken }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await loginUsuario(credentials);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('email', res.data.email);
      navigate('/'); // Redirigir al Home
    } catch (err) {
      setError('Correo o contraseña incorrectos');
      console.error(err);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
        <h3 className="text-center mb-4">Iniciar Sesión</h3>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="correo@ejemplo.com"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder=""
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100 mb-3">
            Iniciar Sesión
          </Button>
        </Form>

        <div className="text-center">
          <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
        </div>
      </Card>
    </div>
  );
}

export default Login;
