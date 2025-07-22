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
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

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
  const [isProcessing, setIsProcessing] = useState(false);

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
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información del perfil',
          confirmButtonColor: '#3085d6',
        });
      } finally {
        setIsLoading(false);
      }
    };
    cargarPerfil();
  }, [navigate]);

  const handleEditar = () => setEditMode(true);

  const handleGuardar = async () => {
    setIsProcessing(true);
    try {
      const res = await actualizarDatos(perfil.id, { nombre, apellido });
      setPerfil(res.data);
      setEditMode(false);
      await MySwal.fire({
        icon: 'success',
        title: '¡Perfil actualizado!',
        text: 'Tus datos se han guardado correctamente',
        confirmButtonColor: '#3085d6',
      });
    } catch (err) {
      console.error('Error al actualizar datos', err);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al actualizar los datos',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setImagenPreview(URL.createObjectURL(file));
    setImagenError(false);
    
    try {
      const res = await cambiarImagen(perfil.id, file);
      setPerfil(res.data);
      await MySwal.fire({
        icon: 'success',
        title: '¡Foto actualizada!',
        text: 'Tu foto de perfil se ha cambiado correctamente',
        confirmButtonColor: '#3085d6',
      });
    } catch (err) {
      console.error('Error al cambiar imagen', err);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al cambiar la imagen',
        confirmButtonColor: '#3085d6',
      });
      setImagenPreview(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEliminarFavorito = async (productoId) => {
    const result = await MySwal.fire({
      title: '¿Quitar de favoritos?',
      text: "¿Estás seguro que deseas eliminar este producto de tus favoritos?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await eliminarFavorito(perfil.id, productoId);
        setFavoritos(favoritos.filter((f) => f.productoId !== productoId));
        await MySwal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El producto se ha quitado de tus favoritos',
          confirmButtonColor: '#3085d6',
        });
      } catch (err) {
        console.error('Error al eliminar favorito', err);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el favorito',
          confirmButtonColor: '#3085d6',
        });
      }
    }
  };

  const handleCancelarReserva = async (reservaId) => {
    const reserva = reservas.find(r => r.id === reservaId);
    const fechaFin = new Date(reserva.fechaFin);
    const hoy = new Date();

    if (fechaFin < hoy) {
      await MySwal.fire({
        icon: 'info',
        title: 'Reserva completada',
        text: 'Esta reserva ya ha finalizado y no puede ser cancelada',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const result = await MySwal.fire({
      title: '¿Cancelar reserva?',
      html: `
        <div style="text-align: left;">
          <p>¿Estás seguro que deseas cancelar esta reserva?</p>
          <p><strong>Fecha de inicio:</strong> ${new Date(reserva.fechaInicio).toLocaleDateString()}</p>
          <p><strong>Fecha de fin:</strong> ${fechaFin.toLocaleDateString()}</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, mantener'
    });

    if (result.isConfirmed) {
      try {
        await cancelarReserva(reservaId);
        setReservas(reservas.filter((r) => r.id !== reservaId));
        await MySwal.fire({
          icon: 'success',
          title: 'Reserva cancelada',
          text: 'Tu reserva ha sido cancelada exitosamente',
          confirmButtonColor: '#3085d6',
        });
      } catch (err) {
        console.error('Error al cancelar reserva', err);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'No se pudo cancelar la reserva',
          confirmButtonColor: '#3085d6',
        });
      }
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

  if (!perfil) {
    return (
      <div className="text-center mt-5">
        <p>Error al cargar el perfil</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Recargar página
        </button>
      </div>
    );
  }

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
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImagenChange} 
                hidden 
                disabled={isProcessing}
              />
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
                <button 
                  className="btn-save" 
                  onClick={handleGuardar}
                  disabled={isProcessing}
                >
                  <FiSave className="btn-icon" /> 
                  {isProcessing ? 'Guardando...' : 'Guardar'}
                </button>
                <button 
                  className="btn-cancel" 
                  onClick={() => setEditMode(false)}
                  disabled={isProcessing}
                >
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
              <button 
                className="btn-edit" 
                onClick={handleEditar}
                disabled={isProcessing}
              >
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
                <button 
                  className="btn btn-danger btn-sm mt-2" 
                  onClick={() => handleEliminarFavorito(fav.productoId)}
                  disabled={isProcessing}
                >
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
            {reservas.map((reserva) => {
              const fechaFin = new Date(reserva.fechaFin);
              const hoy = new Date();
              const puedeCancelar = fechaFin >= hoy;

              return (
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
                    <div className="reserva-dates">
                      <p><strong>Inicio:</strong> {new Date(reserva.fechaInicio).toLocaleDateString()}</p>
                      <p><strong>Fin:</strong> {fechaFin.toLocaleDateString()}</p>
                    </div>
                  </Link>

                  {puedeCancelar ? (
                    <button
                      className="btn btn-outline-danger btn-sm mt-2"
                      onClick={() => handleCancelarReserva(reserva.id)}
                      disabled={isProcessing}
                    >
                      <FiTrash2 /> Cancelar reserva
                    </button>
                  ) : (
                    <Link
                      to={`/productos/${reserva.productoId}?valorar=true`}
                      className="btn btn-success btn-sm mt-2"
                    >
                      Valorar
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PerfilView;