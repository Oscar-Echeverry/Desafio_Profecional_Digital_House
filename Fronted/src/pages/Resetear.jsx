import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Alert, Button, Form, Card } from 'react-bootstrap';

function Resetear() {
  const [searchParams] = useSearchParams();
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Token no válido o faltante.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      await axios.post(`http://localhost:8080/api/auth/resetear`, null, {
        params: {
          token: token,
          nuevaPassword: nuevaPassword
        }
      });
      setMensaje('Contraseña restablecida correctamente. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error(err);
      setError('Error al restablecer la contraseña. Intenta nuevamente.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
        <h3 className="text-center mb-4">Restablecer Contraseña</h3>
        {mensaje && <Alert variant="success">{mensaje}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="nuevaPassword">
            <Form.Label>Nueva Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            Guardar Nueva Contraseña
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Resetear;
