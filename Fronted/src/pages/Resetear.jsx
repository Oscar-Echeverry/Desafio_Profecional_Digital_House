import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Form, Card, Spinner } from 'react-bootstrap';
import { resetearPassword } from '../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../styles/Resetear.css';

const MySwal = withReactContent(Swal);

function Resetear() {
  const [searchParams] = useSearchParams();
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValido, setTokenValido] = useState(true);
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenValido(false);
      MySwal.fire({
        icon: 'error',
        title: 'Enlace inválido',
        text: 'El enlace de recuperación no es válido o ha expirado',
        confirmButtonColor: '#3085d6',
      }).then(() => navigate('/recuperar'));
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetearPassword(token, nuevaPassword);
      
      await MySwal.fire({
        icon: 'success',
        title: '¡Contraseña actualizada!',
        html: `
          <div style="text-align: left;">
            <p>Tu contraseña ha sido restablecida exitosamente.</p>
            <p>Ahora puedes iniciar sesión con tu nueva contraseña.</p>
          </div>
        `,
        confirmButtonColor: '#3085d6',
      });
      
      navigate('/login');
    } catch (err) {
      console.error(err);
      await MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'No se pudo restablecer la contraseña. Intenta nuevamente.',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValido) {
    return (
      <div className="resetear-container">
        <Card className="resetear-card">
          <h3 className="text-center mb-4">Enlace inválido</h3>
          <p className="text-center">El enlace de recuperación no es válido o ha expirado.</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/recuperar')}
            className="w-100"
          >
            Solicitar nuevo enlace
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="resetear-container">
      <Card className="resetear-card">
        <h3 className="text-center mb-4">Restablecer Contraseña</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="nuevaPassword">
            <Form.Label>Nueva Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              required
              minLength="8"
              disabled={isLoading}
            />
            <Form.Text className="text-muted">
              La contraseña debe tener al menos 8 caracteres
            </Form.Text>
          </Form.Group>
          <Button 
            type="submit" 
            variant="primary" 
            className="w-100"
            disabled={isLoading || !nuevaPassword}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Procesando...
              </>
            ) : 'Guardar Nueva Contraseña'}
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Resetear;