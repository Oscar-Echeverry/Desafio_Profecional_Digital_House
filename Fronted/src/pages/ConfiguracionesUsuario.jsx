import React, { useEffect, useState } from 'react';
import {
  obtenerPerfil,
  actualizarDatos,
  cambiarPassword,
  cambiarImagen,
} from '../services/api';
import {Form,Button,Card,Row,Col,Image,Spinner,
} from 'react-bootstrap';
import '../styles/ConfiguracionesUsuario.css';

function ConfiguracionesUsuario({ token, setToken }) {
  const [perfil, setPerfil] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', apellido: '' });
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [imagen, setImagen] = useState(null);
  const [imagenError, setImagenError] = useState(false);
  const [loading, setLoading] = useState(true);

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
  };

  const handleDatos = async (e) => {
    e.preventDefault();
    try {
      await actualizarDatos(perfil.id, formData);
      alert('Datos actualizados correctamente');
      cargarPerfil();
    } catch (err) {
      alert('Error al actualizar los datos');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (!nuevaPassword) {
      alert('La nueva contraseña no puede estar vacía');
      return;
    }
    try {
      await cambiarPassword(perfil.id, { nueva: nuevaPassword });
      alert('Contraseña actualizada correctamente');
      setNuevaPassword('');
    } catch (err) {
      alert('Error al cambiar la contraseña');
    }
  };

  const handleImagen = async (e) => {
    e.preventDefault();
    if (!imagen) {
      alert('Selecciona una imagen');
      return;
    }
    try {
      await cambiarImagen(perfil.id, imagen);
      alert('Imagen de perfil actualizada');
      setImagen(null);
      setImagenError(false);
      cargarPerfil();
    } catch (err) {
      alert('Error al actualizar la imagen de perfil');
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

  // Solo mostrar configuración para usuarios con rol USER
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
          <Button type="submit" variant="primary">Actualizar</Button>
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
          <Button type="submit" variant="warning">Cambiar contraseña</Button>
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
          <Button type="submit" variant="info">Actualizar imagen</Button>
        </Form>
      </div>
    </Card>
  );
}

export default ConfiguracionesUsuario;
