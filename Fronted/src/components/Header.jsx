import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Dropdown, Image } from 'react-bootstrap';

function Header({ token, setToken, usuario }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm px-3">
      <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
        <img src="/logo.png" alt="Logo" height="40" />
        <small className="text-muted">Reservá fácil, viajá mejor</small>
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className="justify-content-end">
        {!token || !usuario ? (
          <>
            <Link to="/register" className="btn btn-outline-primary me-2">
              Crear cuenta
            </Link>
            <Link to="/login" className="btn btn-outline-success">
              Iniciar sesión
            </Link>
          </>
        ) : (
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" id="dropdown-user">
              {usuario.imagenPerfil ? (
                <Image
                  src={usuario.imagenPerfil}
                  roundedCircle
                  width="40"
                  height="40"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    textTransform: 'uppercase',
                  }}
                >
                  {usuario?.nombre?.[0]}
                  {usuario?.apellido?.[0]}
                </div>
              )}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {usuario.rol === 'ADMIN' ? (
                <>
                  <Dropdown.Item as={Link} to="/perfil">Perfil</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/admin-panel">Admin Panel</Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Item as={Link} to="/perfil">Mi Perfil</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/configuraciones">Configuración</Dropdown.Item>
                </>
              )}
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
