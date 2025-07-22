import React from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/ProductRecommendations.css';

function ProductRecommendations({ productos }) {
  return (
    <section className="recommendations-fullwidth-container">
      <div className="recommendations-wrapper">
        <h2 className="recommendations-title">Recomendaciones</h2>

        {productos.length === 0 ? (
          <p className="text-center">No se encontraron productos.</p>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {productos.map((producto) => (
              <Col key={producto.id}>
                <Card className="recommendation-card h-100">
                  <Card.Img
                    variant="top"
                    src={producto.imagenes?.[0] || 'https://via.placeholder.com/400x200'}
                    alt={producto.nombre}
                  />
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Badge bg="info">
                        {typeof producto.categoria === 'string'
                          ? producto.categoria
                          : producto.categoria?.nombre || 'Sin categoría'}
                      </Badge>
                      <span className="rating">
                        ★ {producto.puntuacionPromedio?.toFixed(1) || 'N/A'}
                      </span>
                    </div>

                    <Card.Title>{producto.nombre}</Card.Title>

                    <Card.Text className="text-muted mb-1">
                      📍 {producto.ciudad}
                    </Card.Text>

                    <Card.Text>{producto.descripcion?.slice(0, 100)}...</Card.Text>

                    <Button variant="outline-primary" as={Link} to={`/productos/${producto.id}`}>
                      Ver más
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </section>
  );
}

export default ProductRecommendations;
