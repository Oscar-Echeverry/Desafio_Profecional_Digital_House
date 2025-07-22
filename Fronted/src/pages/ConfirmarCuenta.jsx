import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmarCuenta } from '../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../styles/ConfirmarCuenta.css';

const MySwal = withReactContent(Swal);

function ConfirmarCuenta() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const alreadyConfirmed = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      MySwal.fire({
        icon: 'error',
        title: 'Token inválido',
        text: 'El enlace de confirmación no es válido.',
        confirmButtonColor: '#3085d6',
      }).then(() => navigate('/login'));
      return;
    }

    if (alreadyConfirmed.current) return;
    alreadyConfirmed.current = true;

    const confirmar = async () => {
      try {
        const response = await confirmarCuenta(token);

        await MySwal.fire({
          icon: 'success',
          title: '¡Cuenta confirmada!',
          html: `
            <div style="text-align: center;">
              <p>${response.data || 'Tu cuenta ha sido confirmada exitosamente.'}</p>
              <p>Ahora puedes iniciar sesión con tus credenciales.</p>
            </div>
          `,
          confirmButtonText: 'Ir a Login',
          confirmButtonColor: '#3085d6',
          allowOutsideClick: false,
          allowEscapeKey: false
        });

        navigate('/login');
      } catch (err) {
        console.error('Error al confirmar cuenta:', err);

        await MySwal.fire({
          icon: 'error',
          title: 'Error al confirmar',
          html: `
            <div style="text-align: center;">
              <p>${err.response?.data?.message || 'No se pudo confirmar tu cuenta.'}</p>
              <p>El enlace puede haber expirado o ser inválido.</p>
            </div>
          `,
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#3085d6'
        });

        navigate('/login');
      }
    };

    confirmar();
  }, [searchParams, navigate]);

  return (
    <div className="confirmar-cuenta-container">
      <div className="confirmar-cuenta-card">
        <div className="spinner-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Confirmando cuenta...</span>
          </div>
          <p className="mt-3">Confirmando tu cuenta...</p>
        </div>
      </div>
    </div>
  );
}

export default ConfirmarCuenta;
