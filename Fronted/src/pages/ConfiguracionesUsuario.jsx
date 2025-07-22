import React, { useEffect, useState } from 'react';
import {
  obtenerPerfil,
  actualizarDatos,
  cambiarPassword,
  cambiarImagen,
} from '../services/api';
import { Form, Button, Card, Row, Col, Image, Spinner } from 'react-bootstrap';
import '../styles/ConfiguracionesUsuario.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function ConfiguracionesUsuario({ token, setToken }) {
  const [perfil, setPerfil] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', apellido: '' });
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenError, setImagenError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cargarPerfil = async () => {
    try {
      const res = await obtenerPerfil();
      setPerfil(res.data);
      setFormData({
        nombre: res.data.nombre,
        apellido: res.data.apellido,
      });
      setImagenError(false);
    } catch (err) {
      console.error('Error al obtener el perfil:', err);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar el perfil del usuario',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      cargarPerfil();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setToken(null);
    MySwal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión correctamente',
      confirmButtonColor: '#3085d6',
    });
  };

  const handleDatos = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await actualizarDatos(perfil.id, formData);
      await MySwal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        text: 'Tus datos personales se han actualizado correctamente',
        confirmButtonColor: '#3085d6',
      });
      cargarPerfil();
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al actualizar los datos',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (!nuevaPassword) {
      MySwal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'La nueva contraseña no puede estar vacía',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    const result = await MySwal.fire({
      title: '¿Cambiar contraseña?',
      text: "Estás a punto de cambiar tu contraseña. ¿Deseas continuar?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      setIsSubmitting(true);
      try {
        await cambiarPassword(perfil.id, { nueva: nuevaPassword });
        await MySwal.fire({
          icon: 'success',
          title: '¡Contraseña actualizada!',
          text: 'Tu contraseña se ha cambiado correctamente',
          confirmButtonColor: '#3085d6',
        });
        setNuevaPassword('');
      } catch (err) {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: err.response?.data?.message || 'Error al cambiar la contraseña',
          confirmButtonColor: '#3085d6',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleImagen = async (e) => {
    e.preventDefault();
    if (!imagen) {
      MySwal.fire({
        icon: 'warning',
        title: 'Imagen requerida',
        text: 'Debes seleccionar una imagen para actualizar tu foto de perfil',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await cambiarImagen(perfil.id, imagen);
      await MySwal.fire({
        icon: 'success',
        title: '¡Imagen actualizada!',
        text: 'Tu foto de perfil se ha cambiado correctamente',
        confirmButtonColor: '#3085d6',
      });
      setImagen(null);
      setImagenError(false);
      cargarPerfil();
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Error al actualizar la imagen',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAvatar = () => {
    const url = perfil?.imagenPerfil;
    if (url && !imagenError) {
      return (
        <Image
          src={url}
          onError={() => setImagenError(true)}
          alt="Avatar"
          roundedCircle
          width={100}
          height={100}
          className="me-3"
        />
      );
    }
    return (
      <div className="initials-avatar me-3">
        {perfil?.nombre?.[0]}{perfil?.apellido?.[0]}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center mt-5">
        <h4>Debes iniciar sesión para acceder a la configuración.</h4>
        <Button variant="primary" href="/login" className="mt-3">
          Ir al login
        </Button>
      </div>
    );
  }

  if (perfil && perfil.rol.toUpperCase() !== 'USER') {
    return null;
  }

  return (
    <Card className="config-card">
      <div className="config-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          {renderAvatar()}
          <div>
            <h4 className="mb-0">{perfil.nombre} {perfil.apellido}</h4>
            <p className="text-muted mb-0">{perfil.email}</p>
          </div>
        </div>
        <Button variant="outline-danger" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>

      <div className="config-section">
        <h5>Editar datos</h5>
        <Form onSubmit={handleDatos}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.apellido}
                  onChange={(e) =>
                    setFormData({ ...formData, apellido: e.target.value })
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </Form>
      </div>

      <hr />

      <div className="config-section">
        <h5>Cambiar contraseña</h5>
        <Form onSubmit={handlePassword}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Nueva contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" variant="warning" disabled={isSubmitting}>
            {isSubmitting ? 'Cambiando...' : 'Cambiar contraseña'}
          </Button>
        </Form>
      </div>

      <hr />

      <div className="config-section">
        <h5>Cambiar imagen de perfil</h5>
        <Form onSubmit={handleImagen}>
          <Form.Group className="mb-3">
            <Form.Control
              type="file"
              onChange={(e) => setImagen(e.target.files[0])}
              required
            />
          </Form.Group>
          <Button type="submit" variant="info" disabled={isSubmitting}>
            {isSubmitting ? 'Actualizando...' : 'Actualizar imagen'}
          </Button>
        </Form>
      </div>
    </Card>
  );
}

export default ConfiguracionesUsuario;