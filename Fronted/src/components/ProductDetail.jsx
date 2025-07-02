import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel, Badge } from 'react-bootstrap';
import { getIconComponent } from '../utils/iconUtils';
const ProductDetail = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch(`http://localhost:8080/api/productos/${id}`);
        const productoData = await prodRes.json();

        const caracRes = await fetch(`http://localhost:8080/api/caracteristicas`);
        const todasLasCaracteristicas = await caracRes.json();

        const caracteristicasCompletas = productoData.caracteristicas.map((nombre) =>
          todasLasCaracteristicas.find((c) => c.nombre === nombre)
        );

        setProducto({ ...productoData, caracteristicas: caracteristicasCompletas });
      } catch (error) {
        console.error('Error al cargar datos del producto:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Cargando producto...</div>;
  if (!producto) return <div className="text-center mt-5">No se encontró el producto.</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-3">{producto.nombre}</h2>

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
        <div className="mb-3">
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
    </div>
  );
};

export default ProductDetail;
