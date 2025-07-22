import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
//fronted bueno original ya con areglo


import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PerfilView from './pages/PerfilView';
import ConfiguracionesUsuario from './pages/ConfiguracionesUsuario';
import AdminPanel from './pages/AdminPanel';
import Recuperar from './pages/Recuperar';
import Resetear from './pages/Resetear';
import ProductDetail from './components/ProductDetail';
import ConfirmarCuenta from './pages/ConfirmarCuenta';
import Reserva from './pages/ReservaForm';
import WhatsAppFloat from './components/WhatsAppFloat';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';


function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (e) {
    return true;
  }
}

function App() {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      setToken(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch('https://tripnest.duckdns.org/api/usuarios/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUsuario(data);
        } else {
          console.warn('Token inválido. Cerrando sesión.');
          localStorage.removeItem('token');
          localStorage.removeItem('email');
          setToken(null);
          setUsuario(null);
        }
      } catch (err) {
        console.error('Error al obtener usuario:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setToken(null);
        setUsuario(null);
      }
    };

    if (token) {
      fetchUsuario();
    } else {
      setUsuario(null);
    }
  }, [token]);

  if (loading) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header token={token} setToken={setToken} usuario={usuario} />
        <main className="flex-grow-1 container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                !token ? (
                  <Login
                    setToken={(tk) => {
                      setToken(tk);
                      localStorage.setItem('token', tk);
                    }}
                  />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/recuperar" element={<Recuperar />} />
            <Route path="/api/auth/resetear" element={<Resetear />} />
            <Route path="/confirmar" element={<ConfirmarCuenta />} />
            <Route path="/privacidad" element={<PoliticaPrivacidad />} />
            <Route
              path="/perfil"
              element={token ? <PerfilView /> : <Navigate to="/login" />}
            />
            <Route
              path="/configuraciones"
              element={
                token ? (
                  <ConfiguracionesUsuario
                    token={token}
                    setToken={setToken}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin-panel"
              element={
                token && usuario?.rol === 'ADMIN' ? (
                  <AdminPanel />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route
              path="/reservar/:id"
              element={token ? <Reserva /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<h2>Página no encontrada</h2>} />
          </Routes>
        </main>
        <WhatsAppFloat/>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
