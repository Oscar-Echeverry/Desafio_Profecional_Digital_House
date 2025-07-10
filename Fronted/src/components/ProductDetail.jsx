import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Carousel, Badge, Dropdown, Alert } from 'react-bootstrap';
import { FiShare2, FiHeart, FiStar } from 'react-icons/fi';
import '../styles/ProductDetail.css';
import CalendarOcupadas from '../components/CalendarOcupadas';
import { Helmet } from 'react-helmet-async';
import {
  WhatsappShareButton, FacebookShareButton, TwitterShareButton, EmailShareButton,
  WhatsappIcon, FacebookIcon, TwitterIcon, EmailIcon
} from 'react-share';
import api from '../services/api';
import { getIconComponent } from '../utils/iconUtils';

const ProductDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const valorar = searchParams.get('valorar') === 'true';
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [esFavorito, setEsFavorito] = useState(false);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [puntuacion, setPuntuacion] = useState('');
  const [comentario, setComentario] = useState('');
  const [enviandoValoracion, setEnviandoValoracion] = useState(false);
  const [errorValoracion, setErrorValoracion] = useState(null);
  const [valoracionEnviada, setValoracionEnviada] = useState(false);
  const [valoraciones, setValoraciones] = useState([]);

  const urlDelProducto = `${window.location.origin}/productos/${id}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productoResponse, caracteristicasResponse, reservasResponse] = await Promise.all([
          api.get(`/productos/${id}`),
          api.get('/caracteristicas'),
          api.get(`/reservas/producto/${id}`)
        ]);

        const productoData = productoResponse.data;
        const todasLasCaracteristicas = caracteristicasResponse.data;

        const caracteristicasCompletas = productoData.caracteristicas?.map((nombre) =>
          todasLasCaracteristicas.find((c) => c.nombre === nombre)
        ) || [];

        setProducto({ ...productoData, caracteristicas: caracteristicasCompletas });
        setFechasOcupadas(reservasResponse.data.map((r) => ({
          inicio: r.fechaInicio,
          fin: r.fechaFin
        })));

        // Cargar valoraciones existentes
        const valoracionesResponse = await api.get(`/productos/${id}/valoraciones`);
        setValoraciones(valoracionesResponse.data.valoraciones || []);

        // Verificar favoritos si está autenticado
        const token = localStorage.getItem('token');
        const usuarioId = localStorage.getItem('usuarioId');
        
        if (token && usuarioId) {
          try {
            const favsResponse = await api.get(`/favoritos/${usuarioId}`);
            setEsFavorito(favsResponse.data.some(f => f.productoId === productoData.id));
          } catch (error) {
            console.warn('Error al cargar favoritos:', error);
            if (error?.response?.status === 401 || error?.response?.status === 403) {
              localStorage.removeItem('token');
              localStorage.removeItem('usuarioId');
            }
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleFavorito = async () => {
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('usuarioId');

    if (!token || !usuarioId) {
      navigate('/login', { state: { from: `/productos/${id}` } });
      return;
    }

    try {
      if (esFavorito) {
        await api.delete(`/favoritos/${usuarioId}/${producto.id}`);
      } else {
        await api.post(`/favoritos/${usuarioId}/${producto.id}`);
      }
      setEsFavorito(!esFavorito);
    } catch (error) {
      console.error('Error al actualizar favorito:', error);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioId');
        navigate('/login');
      }
    }
  };

  const handleSubmitValoracion = async (e) => {
    e.preventDefault();
    setEnviandoValoracion(true);
    setErrorValoracion(null);

    try {
      const usuarioId = localStorage.getItem('usuarioId');
      if (!usuarioId) throw new Error('Usuario no identificado');

      // Validación básica
      if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
        throw new Error('Selecciona una puntuación válida (1-5)');
      }

      // Preparar parámetros como URLSearchParams
      const params = new URLSearchParams();
      params.append('puntuacion', puntuacion);
      if (comentario) params.append('comentario', comentario);
      params.append('usuarioId', usuarioId);

      // Enviar valoración con Content-Type adecuado
      await api.post(`/productos/${id}/valorar`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // Actualizar la lista de valoraciones
      const valoracionesResponse = await api.get(`/productos/${id}/valoraciones`);
      setValoraciones(valoracionesResponse.data.valoraciones || []);

      setValoracionEnviada(true);
      setTimeout(() => navigate(`/productos/${id}`), 2000);
    } catch (error) {
      console.error('Error al enviar valoración:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });

      let mensajeError = 'Error al enviar valoración';
      if (error.response?.status === 403) {
        mensajeError = error.response.data?.message || 'No tienes permiso para valorar este producto';
      } else if (error.response?.status === 401) {
        mensajeError = 'Tu sesión ha expirado';
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioId');
      } else if (error.message) {
        mensajeError = error.message;
      }

      setErrorValoracion(mensajeError);
    } finally {
      setEnviandoValoracion(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando producto...</div>;
  if (!producto) return <div className="text-center mt-5">No se encontró el producto.</div>;

  return (
    <div className="container my-5">
      <Helmet>
        <title>{producto.nombre}</title>
        <meta property="og:title" content={producto.nombre} />
        <meta property="og:description" content={producto.descripcion?.slice(0, 150)} />
        <meta property="og:image" content={producto.imagenes?.[0]} />
        <meta property="og:url" content={urlDelProducto} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="d-flex justify-content-between align-items-start mb-3">
        <h2 className="mb-0">{producto.nombre}</h2>
        <div className="d-flex gap-3 align-items-center">
          <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-compartir" title="Compartir">
              <FiShare2 size={20} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as="div">
                <WhatsappShareButton url={urlDelProducto} title={producto.nombre}>
                  <WhatsappIcon size={24} round /> WhatsApp
                </WhatsappShareButton>
              </Dropdown.Item>
              <Dropdown.Item as="div">
                <FacebookShareButton url={urlDelProducto} quote={producto.nombre}>
                  <FacebookIcon size={24} round /> Facebook
                </FacebookShareButton>
              </Dropdown.Item>
              <Dropdown.Item as="div">
                <TwitterShareButton url={urlDelProducto} title={producto.nombre}>
                  <TwitterIcon size={24} round /> Twitter
                </TwitterShareButton>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <FiHeart
            size={22}
            style={{ cursor: 'pointer', color: esFavorito ? 'red' : 'black' }}
            title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            onClick={toggleFavorito}
          />
        </div>
      </div>

      {producto.imagenes?.length > 0 && (
        <Carousel className="mb-4">
          {producto.imagenes.map((img, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={img}
                alt={`Imagen ${index + 1}`}
                style={{ maxHeight: '500px', objectFit: 'cover' }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}

      <p className="text-muted">{producto.descripcion}</p>

      <div className="mb-3">
        <strong>Dirección:</strong> {producto.direccion}
      </div>

      <div className="mb-3">
        <strong>Categoría:</strong>{' '}
        <Badge bg="secondary">{producto.categoria}</Badge>
      </div>

      {producto.caracteristicas?.length > 0 && (
        <div className="product-caracteristicas">
          <strong>Características:</strong>
          <div className="d-flex flex-wrap gap-3 mt-2">
            {producto.caracteristicas.map((caracteristica, index) => {
              const Icon = getIconComponent(caracteristica?.icono);
              return (
                <div
                  key={index}
                  className="d-flex align-items-center gap-2 px-3 py-2 border rounded bg-light"
                  style={{ fontSize: '0.9rem' }}
                >
                  {Icon && <Icon size={18} />} {caracteristica?.nombre}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {producto.politicas?.length > 0 && (
        <div className="politicas-section">
          <h5>Políticas del producto</h5>
          <div className="mt-3">
            {producto.politicas.map((politica, index) => (
              <div key={index} className="politica-card">
                <div className="politica-titulo">{politica.titulo}</div>
                <div className="politica-descripcion">{politica.descripcion}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="calendar-section">
        <h5>Disponibilidad del producto</h5>
        <p className="text-muted">Fechas ya reservadas aparecerán bloqueadas en el calendario:</p>
        <CalendarOcupadas fechasOcupadas={fechasOcupadas} />
      </div>

      <div className="text-center">
        <button
          className="btn btn-success"
          onClick={() => navigate(`/reservar/${producto.id}`)}
        >
          Reservar este producto
        </button>
      </div>

      {/* Sección de valoraciones existentes */}
      {valoraciones.length > 0 && (
        <div className="mt-5">
          <h4>Valoraciones de usuarios</h4>
          <div className="row">
            {valoraciones.map((valoracion, index) => (
              <div key={index} className="col-md-6 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="card-title">{valoracion.usuario || 'Usuario anónimo'}</h5>
                      <div className="text-warning">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            fill={i < valoracion.puntuacion ? "currentColor" : "none"}
                            className="me-1"
                          />
                        ))}
                      </div>
                    </div>
                    <small className="text-muted d-block mb-2">
                      {new Date(valoracion.fecha).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </small>
                    {valoracion.comentario && (
                      <p className="card-text">{valoracion.comentario}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {valorar && (
        <div className="valoracion-section mt-5 p-4 border rounded bg-light">
          {valoracionEnviada ? (
            <Alert variant="success" className="text-center">
              <FiStar size={24} className="mb-2" />
              <h4>¡Gracias por tu valoración!</h4>
              <p>Redirigiendo a la página del producto...</p>
            </Alert>
          ) : (
            <>
              <h4 className="mb-4 text-center">
                <FiStar className="me-2" />
                Valorar este producto
              </h4>

              {errorValoracion && (
                <Alert variant="danger" className="mb-3">
                  {errorValoracion}
                </Alert>
              )}

              <form onSubmit={handleSubmitValoracion}>
                <div className="mb-3">
                  <label className="form-label">Puntuación (1-5 estrellas)</label>
                  <select
                    className="form-select"
                    value={puntuacion}
                    onChange={(e) => setPuntuacion(e.target.value)}
                    required
                  >
                    <option value="">Selecciona una puntuación</option>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} - {['Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][num - 1]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Comentario (opcional)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    maxLength="500"
                    placeholder="Escribe tu experiencia con este producto..."
                  ></textarea>
                </div>
                <div className="d-flex justify-content-center gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={enviandoValoracion}
                  >
                    {enviandoValoracion ? 'Enviando...' : 'Enviar valoración'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(`/productos/${id}`)}
                    disabled={enviandoValoracion}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;