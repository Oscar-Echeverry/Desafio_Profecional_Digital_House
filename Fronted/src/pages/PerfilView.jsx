import React, { useEffect, useState } from 'react';
import {
  obtenerPerfil,
  actualizarDatos,
  cambiarImagen,
  obtenerFavoritos,
  eliminarFavorito,
  obtenerMisReservas,
  cancelarReserva
} from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/PerfilView.css';
import {
  FiEdit, FiSave, FiX, FiCamera, FiMail, FiUser, FiCalendar, FiTrash2
} from 'react-icons/fi';

function PerfilView() {
  const [perfil, setPerfil] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenError, setImagenError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [favoritos, setFavoritos] = useState([]);
  const [reservas, setReservas] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    const cargarPerfil = async () => {
      try {
        setIsLoading(true);
        const res = await obtenerPerfil();
        setPerfil(res.data);
        setNombre(res.data.nombre);
        setApellido(res.data.apellido);

        const favsRes = await obtenerFavoritos(res.data.id);
        setFavoritos(favsRes.data);

        const reservasRes = await obtenerMisReservas();
        setReservas(reservasRes.data);
      } catch (err) {
        console.error('Error al cargar perfil, favoritos o reservas', err);
      } finally {
        setIsLoading(false);
      }
    };
    cargarPerfil();
  }, [navigate]);

  const handleEditar = () => setEditMode(true);

  const handleGuardar = async () => {
    try {
      const res = await actualizarDatos(perfil.id, { nombre, apellido });
      setPerfil(res.data);
      setEditMode(false);
    } catch (err) {
      console.error('Error al actualizar datos', err);
    }
  };

  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenPreview(URL.createObjectURL(file));
      setImagenError(false);
      try {
        const res = await cambiarImagen(perfil.id, file);
        setPerfil(res.data);
      } catch (err) {
        console.error('Error al cambiar imagen', err);
      }
    }
  };

  const handleEliminarFavorito = async (productoId) => {
    try {
      await eliminarFavorito(perfil.id, productoId);
      setFavoritos(favoritos.filter((f) => f.productoId !== productoId));
    } catch (err) {
      console.error('Error al eliminar favorito', err);
    }
  };

  const handleCancelarReserva = async (reservaId) => {
    try {
      await cancelarReserva(reservaId);
      setReservas(reservas.filter((r) => r.id !== reservaId));
    } catch (err) {
      console.error('Error al cancelar reserva', err);
    }
  };

  const renderAvatar = () => {
    const mostrarImagen = (imagenPreview || perfil?.imagenPerfil) && !imagenError;
    if (mostrarImagen) {
      return (
        <img
          src={imagenPreview || perfil.imagenPerfil}
          alt="Perfil"
          className="profile-avatar"
          onError={() => setImagenError(true)}
        />
      );
    }

    return (
      <div className="profile-avatar initials-avatar">
        {perfil?.nombre?.[0]}{perfil?.apellido?.[0]}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!perfil) return <p className="text-center mt-5">Error al cargar el perfil</p>;

  return (
    <div className="profile-container">
      {/* Portada y tarjeta */}
      <div className="cover-section"><div className="cover-overlay"></div></div>
      <div className="profile-card animate__animated animate__fadeIn">
        <div className="avatar-wrapper">
          <div className="avatar-container">
            {renderAvatar()}
            <label className="change-photo-btn" title="Cambiar foto">
              <FiCamera className="camera-icon" />
              <input type="file" accept="image/*" onChange={handleImagenChange} hidden />
            </label>
          </div>
        </div>

        <div className="info-section">
          {editMode ? (
            <div className="edit-form">
              <h3 className="form-title">Editar perfil</h3>
              <div className="form-group">
                <label className="form-label">
                  <FiUser className="input-icon" /> Nombre
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <FiUser className="input-icon" /> Apellido
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Apellido"
                />
              </div>
              <div className="button-group">
                <button className="btn-save" onClick={handleGuardar}>
                  <FiSave className="btn-icon" /> Guardar
                </button>
                <button className="btn-cancel" onClick={() => setEditMode(false)}>
                  <FiX className="btn-icon" /> Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-info">
              <h2 className="profile-name">{perfil.nombre} {perfil.apellido}</h2>
              <div className="profile-detail">
                <FiMail className="detail-icon" /> <span>{perfil.email}</span>
              </div>
              <div className="profile-detail">
                <FiUser className="detail-icon" /> <span>{perfil.rol}</span>
              </div>
              <button className="btn-edit" onClick={handleEditar}>
                <FiEdit className="btn-icon" /> Editar perfil
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Favoritos */}
      <div className="favorites-section">
        <h3 className="section-title">Productos favoritos</h3>
        {favoritos.length === 0 ? (
          <p className="text-center text-muted">No tienes productos en favoritos aún.</p>
        ) : (
          <div className="favorites-grid">
            {favoritos.map((fav) => (
              <div key={fav.id} className="favorite-card">
                <Link to={`/productos/${fav.productoId}`} className="text-decoration-none text-dark">
                  <h4>{fav.nombreProducto}</h4>
                  {fav.imagenProducto && (
                    <img src={fav.imagenProducto} alt={fav.nombreProducto} className="favorite-image" />
                  )}
                </Link>
                <button className="btn btn-danger btn-sm mt-2" onClick={() => handleEliminarFavorito(fav.productoId)}>
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reservas */}
      <div className="reservas-section mt-5">
        <h3 className="section-title"><FiCalendar /> Mis reservas</h3>
        {reservas.length === 0 ? (
          <p className="text-center text-muted">No tienes reservas activas.</p>
        ) : (
          <div className="reservas-grid">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="reserva-card">
                <Link to={`/productos/${reserva.productoId}`} className="text-decoration-none text-dark">
                  <h4>{reserva.nombreProducto}</h4>
                  {reserva.imagenProducto && (
                    <img
                      src={reserva.imagenProducto}
                      alt={reserva.nombreProducto}
                      className="favorite-image"
                    />
                  )}
                </Link>

                {/* Botón cancelar si la reserva aún no ha pasado */}
                {new Date(reserva.fechaFin) >= new Date() && (
                  <button
                    className="btn btn-outline-danger btn-sm mt-2"
                    onClick={() => handleCancelarReserva(reserva.id)}
                  >
                    <FiTrash2 /> Cancelar reserva
                  </button>
                )}

                {/* Botón valorar si ya terminó */}
                {new Date(reserva.fechaFin) < new Date() && (
                  <Link
                    to={`/productos/${reserva.productoId}?valorar=true`}
                    className="btn btn-success btn-sm mt-2"
                  >
                    Valorar
                  </Link>
                )}
              </div>

            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PerfilView;
