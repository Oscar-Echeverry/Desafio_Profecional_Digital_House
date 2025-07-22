import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../services/api';
import '../styles/Register.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
  });

  const [errorClave, setErrorClave] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      const isValid = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(value);
      setErrorClave(!isValid);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isPasswordValid = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(formData.password);
    if (!isPasswordValid) {
      setErrorClave(true);
      MySwal.fire({
        icon: 'error',
        title: 'Contraseña inválida',
        text: 'La contraseña debe tener al menos 8 caracteres e incluir letras, números y un carácter especial.',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    try {
      await registrarUsuario(formData);
      
      // Mostrar alerta de verificación de correo
      MySwal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        html: `
          <div style="text-align: left;">
            <p>Tu cuenta ha sido creada con éxito.</p>
            <p><strong>IMPORTANTE:</strong> Para activar tu cuenta, debes verificar tu correo electrónico.</p>
            <p>Hemos enviado un enlace de verificación a: <strong>${formData.email}</strong></p>
            <p style="color: #ff6b6b;">Si no ves el correo, revisa tu carpeta de spam.</p>
          </div>
        `,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        navigate('/login');
      });

    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: error.response?.data?.message || 'Verifica que el correo no esté en uso',
        confirmButtonColor: '#3085d6',
      });
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h3>Crear cuenta</h3>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="register-row">
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                required
                className={errorClave ? 'error' : ''}
                onChange={handleChange}
              />
              {errorClave && (
                <span className="error-text">
                  La contraseña debe tener al menos 8 caracteres, incluyendo letras, números y un carácter especial.
                </span>
              )}
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;