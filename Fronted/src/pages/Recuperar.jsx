import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Button, Form, Card } from 'react-bootstrap';

function Recuperar() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      await axios.post(`http://localhost:8080/api/auth/recuperar?email=${email}`);
      setMensaje('Correo de recuperación enviado. Revisa tu bandeja de entrada.');
    } catch (err) {
      console.error(err);
      setError('Error al enviar el correo. Verifica el email.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
        <h3 className="text-center mb-4">Recuperar Contraseña</h3>
        {mensaje && <Alert variant="success">{mensaje}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            Enviar Correo
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Recuperar;
