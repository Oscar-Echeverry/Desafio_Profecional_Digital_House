import React, { useEffect, useState, useRef } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { obtenerProductos } from '../services/api';
import '../styles/HeroBanner.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function HeroBanner({ filtro, setFiltro, buscarProductos }) {
  const [ciudadesSugeridas, setCiudadesSugeridas] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const recommendationsRef = useRef(null);

  useEffect(() => {
    const cargarCiudades = async () => {
      try {
        setIsLoadingCities(true);
        const res = await obtenerProductos();
        const productos = res.data;
        const ciudadesUnicas = [...new Set(productos.map(p => p.ciudad.trim()))]
          .filter(ciudad => ciudad)
          .sort();
        
        setCiudadesSugeridas(ciudadesUnicas);
      } catch (err) {
        console.error('Error cargando ciudades:', err);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las ciudades disponibles',
          confirmButtonColor: '#3085d6',
        });
      } finally {
        setIsLoadingCities(false);
      }
    };

    cargarCiudades();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!filtro.ciudad) {
      await MySwal.fire({
        icon: 'warning',
        title: 'Destino requerido',
        text: 'Por favor ingresa una ciudad o destino',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (!filtro.fechaInicio || !filtro.fechaFin) {
      await MySwal.fire({
        icon: 'warning',
        title: 'Fechas requeridas',
        text: 'Por favor selecciona ambas fechas',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    if (new Date(filtro.fechaInicio) > new Date(filtro.fechaFin)) {
      await MySwal.fire({
        icon: 'warning',
        title: 'Fechas inválidas',
        text: 'La fecha de check-in debe ser anterior al check-out',
        confirmButtonColor: '#3085d6',
      });
      return;
    }
    await buscarProductos(e);
    setTimeout(() => {
      const recommendationsSection = document.getElementById('recommendations-section');
      if (recommendationsSection) {
        recommendationsSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 1);
  };

  return (
    <div className="hero-banner-fullwidth">
      <div className="hero-banner-overlay" />
      <div className="container hero-banner-content">
        <h1 className="hero-title">Buscá ofertas en hoteles, casas y mucho más</h1>
        <p className="hero-description">
          Encontrá alojamientos disponibles según tu destino y fechas seleccionadas.
        </p>

        <Form className="hero-search-form" onSubmit={handleSubmit}>
          <Row className="align-items-end g-2">
            {/* Campo ciudad con datalist */}
            <Col xs={12} md={5}>
              <Form.Group controlId="ciudad">
                <Form.Label>¿A dónde vamos?</Form.Label>
                <Form.Control
                  list="sugerencias"
                  type="text"
                  placeholder="Ej: Medellín, Colombia"
                  value={filtro.ciudad || ''}
                  onChange={(e) =>
                    setFiltro({ ...filtro, ciudad: e.target.value })
                  }
                  disabled={isLoadingCities}
                />
                {isLoadingCities ? (
                  <div className="mt-2">
                    <Spinner animation="border" size="sm" />
                    <span className="ms-2">Cargando ciudades...</span>
                  </div>
                ) : (
                  <datalist id="sugerencias">
                    {ciudadesSugeridas.map((ciudad, idx) => (
                      <option key={idx} value={ciudad} />
                    ))}
                  </datalist>
                )}
              </Form.Group>
            </Col>

            {/* Fechas */}
            <Col xs={6} md={3}>
              <Form.Group controlId="checkin">
                <Form.Label>Check-in</Form.Label>
                <Form.Control
                  type="date"
                  value={filtro.fechaInicio || ''}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setFiltro({ ...filtro, fechaInicio: e.target.value })
                  }
                />
              </Form.Group>
            </Col>

            <Col xs={6} md={3}>
              <Form.Group controlId="checkout">
                <Form.Label>Check-out</Form.Label>
                <Form.Control
                  type="date"
                  value={filtro.fechaFin || ''}
                  min={filtro.fechaInicio || new Date().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setFiltro({ ...filtro, fechaFin: e.target.value })
                  }
                />
              </Form.Group>
            </Col>

            {/* Botón */}
            <Col xs={12} md={1}>
              <Button
                variant="primary"
                type="submit"
                className="search-button w-100"
              >
                Buscar
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default HeroBanner;