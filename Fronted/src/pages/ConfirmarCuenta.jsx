import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmarCuenta = () => {
  const [mensaje, setMensaje] = useState('Confirmando cuenta...');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setMensaje('Token no proporcionado.');
      setError(true);
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8080/api/auth/confirmar?token=${token}`, {
      method: 'GET',
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          throw new Error(text || 'Error al confirmar cuenta');
        }
        return text;
      })
      .then((text) => {
        setMensaje(text || 'Cuenta confirmada con éxito.');
        setError(false);
      })
      .catch((err) => {
        setMensaje(err.message);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{ maxWidth: 420, width: '90%' }}>
        <div className="text-center mb-3">
          <h3 className={error ? 'text-danger' : 'text-success'}>
            {error ? 'Error' : '¡Éxito!'}
          </h3>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center my-4">
            <div className="spinner-border text-primary" role="status" aria-label="Loading">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <p className={`text-center mb-4 ${error ? 'text-danger' : 'text-success'}`}>
            {mensaje}
          </p>
        )}

        {!loading && (
          <div className="d-flex justify-content-center">
            <button
              onClick={() => navigate('/login')}
              className={`btn ${error ? 'btn-outline-danger' : 'btn-success'} w-100`}
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmarCuenta;
