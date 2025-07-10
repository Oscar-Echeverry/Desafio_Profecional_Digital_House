import React from 'react';
import '../styles/CategoryGrid.css';

function CategoryGrid({ categorias = [], filtrarPorCategoria }) {
  return (
    <section className="category-fullwidth-container">
      <div className="category-wrapper">
        <h2 className="category-title">Buscar por tipo de alojamiento</h2>

        <div className="category-grid">
          {categorias.length > 0 ? (
            categorias.map((category) => (
              <div
                key={category.id}
                className="category-card"
                onClick={() => filtrarPorCategoria(category.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    filtrarPorCategoria(category.id);
                  }
                }}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
              >
                <div className="category-image-container">
                  <img
                    src={category.imagen}
                    alt={category.nombre}
                    className="category-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://via.placeholder.com/300x200?text=Sin+imagen';
                    }}
                  />
                </div>

                <div className="category-info">
                  <h3 className="category-name">{category.nombre}</h3>
                  <p className="category-count">
                    {category.cantidadProductos || 0}{' '}
                    {category.cantidadProductos === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No hay categorías disponibles.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
