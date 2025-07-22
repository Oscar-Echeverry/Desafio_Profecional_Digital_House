import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../services/api';
import '../styles/Register.css';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
  });

  const [mensaje, setMensaje] = useState('');
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
      setMensaje('La contraseña debe tener al menos 6 caracteres e incluir letras, números y un carácter especial.');
      return;
    }

    try {
      await registrarUsuario(formData);
      setMensaje('Usuario registrado. Por favor revisa tu correo para verificar la cuenta.');

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setMensaje(' Error en el registro. Verifica que el correo no esté en uso.');
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h3>Crear cuenta</h3>

        {mensaje && <div className="register-alert">{mensaje}</div>}

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
