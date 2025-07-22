import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUsuario } from '../services/api';
import { Form, Button, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Login({ setToken }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginUsuario(credentials);
      
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuarioId', res.data.id);
      localStorage.setItem('email', res.data.email);
      
      setCredentials({ email: '', password: '' });
      
      // Mensaje de bienvenida
      await MySwal.fire({
        icon: 'success',
        title: `¡Bienvenido!`,
        text: 'Has iniciado sesión correctamente',
        confirmButtonColor: '#3085d6',
      });
      
      navigate('/');

    } catch (err) {
      setIsLoading(false);
      
      if (err.response?.status === 401) {
        // Usuario no verificado
        await MySwal.fire({
          icon: 'warning',
          title: 'Cuenta no verificada',
          html: `
            <div style="text-align: left;">
              <p>Tu cuenta no ha sido verificada aún.</p>
              <p><strong>Por favor revisa tu correo electrónico (incluyendo la carpeta de spam)</strong> 
              y haz clic en el enlace de verificación que te enviamos.</p>
              <p>¿No recibiste el correo? <a href="/reenviar-verificacion">Reenviar correo de verificación</a></p>
            </div>
          `,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Entendido'
        });
      } else {
        // Otros errores
        await MySwal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: err.response?.data?.message || 'Correo o contraseña incorrectos',
          confirmButtonColor: '#3085d6',
        });
      }
      console.error(err);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card className="p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
        <h3 className="text-center mb-4">Iniciar Sesión</h3>

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

          <Button 
            variant="success" 
            type="submit" 
            className="w-100 mb-3"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
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