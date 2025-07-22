import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import '../styles/HeroBanner.css';

function HeroBanner({ filtro, setFiltro, buscarProductos }) {
  const [ciudadesSugeridas, setCiudadesSugeridas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/productos')
      .then(res => {
        const productos = res.data;
        const ciudadesUnicas = [...new Set(productos.map(p => p.ciudad.trim()))];
        setCiudadesSugeridas(ciudadesUnicas);
      })
      .catch(err => console.error('Error cargando ciudades:', err));
  }, []);

  return (
    <div className="hero-banner-fullwidth">
      <div className="hero-banner-overlay" />
      <div className="container hero-banner-content">
        <h1 className="hero-title">Buscá ofertas en hoteles, casas y mucho más</h1>
        <p className="hero-description">
          Encontrá alojamientos disponibles según tu destino y fechas seleccionadas.
        </p>

        <Form className="hero-search-form" onSubmit={buscarProductos}>
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
                />
                <datalist id="sugerencias">
                  {ciudadesSugeridas.map((ciudad, idx) => (
                    <option key={idx} value={ciudad} />
                  ))}
                </datalist>
              </Form.Group>
            </Col>

            {/* Fechas */}
            <Col xs={6} md={3}>
              <Form.Group controlId="checkin">
                <Form.Label>Check-in</Form.Label>
                <Form.Control
                  type="date"
                  value={filtro.fechaInicio || ''}
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
