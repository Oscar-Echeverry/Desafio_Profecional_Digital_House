import React from 'react';
import '../styles/CategoryGrid.css';

function CategoryGrid({ categorias = [] }) {
  return (
    <section className="category-fullwidth-container">
      <div className="category-wrapper">
        <h2 className="category-title">Buscar por tipo de alojamiento</h2>
        
        <div className="category-grid">
          {categorias.length > 0 && categorias.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-image-container">
                <img
                  src={category.imagen}
                  alt={category.nombre}
                  className="category-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Sin+imagen';
                  }}
                />
              </div>

              <div className="category-info">
                <h3 className="category-name">{category.nombre}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryGrid;
