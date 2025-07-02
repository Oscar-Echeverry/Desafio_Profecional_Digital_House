import React, { useEffect, useState } from 'react';
import {
  obtenerPerfil,
  actualizarDatos,
  cambiarImagen
} from '../services/api';
import '../styles/PerfilView.css';
import { FiEdit, FiSave, FiX, FiCamera, FiMail, FiUser } from 'react-icons/fi';

function PerfilView() {
  const [perfil, setPerfil] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenError, setImagenError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setIsLoading(true);
        const res = await obtenerPerfil();
        setPerfil(res.data);
        setNombre(res.data.nombre);
        setApellido(res.data.apellido);
      } catch (err) {
        console.error('Error al cargar perfil', err);
      } finally {
        setIsLoading(false);
      }
    };
    cargarPerfil();
  }, []);

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

    // Avatar por iniciales
    return (
      <div className="profile-avatar initials-avatar">
        {perfil?.nombre?.[0]}{perfil?.apellido?.[0]}
      </div>
    );
  };

  if (isLoading) return (
    <div className="loading-container">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );

  if (!perfil) return <p className="text-center mt-5">Error al cargar el perfil</p>;

  return (
    <div className="profile-container">
      <div className="cover-section">
        <div className="cover-overlay"></div>
      </div>

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
              />
            </label>
          </div>
        </div>

        <div className="info-section">
          {editMode ? (
            <div className="edit-form">
              <h3 className="form-title">Editar perfil</h3>
              <div className="form-group">
                <label htmlFor="nombre" className="form-label">
                  <FiUser className="input-icon" /> Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  className="form-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre"
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellido" className="form-label">
                  <FiUser className="input-icon" /> Apellido
                </label>
                <input
                  id="apellido"
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
              <h2 className="profile-name">
                {perfil.nombre} {perfil.apellido}
              </h2>
              <div className="profile-detail">
                <FiMail className="detail-icon" />
                <span className="detail-text">{perfil.email}</span>
              </div>
              <div className="profile-detail">
                <FiUser className="detail-icon" />
                <span className="detail-text">{perfil.rol}</span>
              </div>
              <button className="btn-edit" onClick={handleEditar}>
                <FiEdit className="btn-icon" /> Editar perfil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PerfilView;
