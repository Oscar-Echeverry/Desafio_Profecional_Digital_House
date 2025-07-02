import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import '../styles/HeroBanner.css';

function HeroBanner({ filtro, setFiltro, buscarProductos }) {
  return (
    <div className="hero-banner-fullwidth">
      <div className="hero-banner-overlay" />
      <div className="container hero-banner-content">
        <h1 className="hero-title">Buscá ofertas en hoteles, casas y mucho más</h1>

        <Form className="hero-search-form" onSubmit={buscarProductos}>
          <Row className="align-items-end g-2">
            <Col xs={12} md={5}>
              <Form.Group controlId="destination">
                <Form.Label>¿A dónde vamos?</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Mdellin, Colombia"
                  value={filtro.nombre}
                  onChange={(e) =>
                    setFiltro({ ...filtro, nombre: e.target.value })
                  }
                />
              </Form.Group>
            </Col>

            <Col xs={6} md={3}>
              <Form.Group controlId="checkin">
                <Form.Label>Check-in</Form.Label>
                <Form.Control
                  type="date"
                  value={filtro.fechaInicio}
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
                  value={filtro.fechaFin}
                  onChange={(e) =>
                    setFiltro({ ...filtro, fechaFin: e.target.value })
                  }
                />
              </Form.Group>
            </Col>

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
