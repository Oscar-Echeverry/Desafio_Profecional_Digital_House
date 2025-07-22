import React, { useState } from 'react';
import { Button, Form, Card, Spinner } from 'react-bootstrap';
import { recuperarPassword } from '../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../styles/Recuperar.css';

const MySwal = withReactContent(Swal);

function Recuperar() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await recuperarPassword(email);
      
      await MySwal.fire({
        icon: 'success',
        title: 'Correo enviado',
        html: `
          <div style="text-align: left;">
            <p>Hemos enviado un correo a <strong>${email}</strong> con instrucciones para restablecer tu contraseña.</p>
            <p style="color: #ff6b6b;">Si no lo ves en tu bandeja de entrada, revisa la carpeta de spam.</p>
          </div>
        `,
        confirmButtonColor: '#3085d6',
      });
      
      setEmail('');
    } catch (err) {
      console.error(err);
      await MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'No se pudo enviar el correo. Verifica el email.',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="recuperar-container">
      <Card className="recuperar-card">
        <h3 className="text-center mb-4">Recuperar Contraseña</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </Form.Group>
          <Button 
            type="submit" 
            variant="primary" 
            className="w-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Enviando...
              </>
            ) : 'Enviar Correo'}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <a href="/login" className="text-decoration-none">
            Volver al inicio de sesión
          </a>
        </div>
      </Card>
    </div>
  );
}

export default Recuperar;