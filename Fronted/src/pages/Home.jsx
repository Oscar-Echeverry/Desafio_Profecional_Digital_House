import React, { useEffect, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import CategoryGrid from '../components/CategoryGrid';
import ProductRecommendations from '../components/ProductRecommendations';
import {
  obtenerProductosHome,
  obtenerCategorias,
  buscarProductosPorFiltro
} from '../services/api';

function Home() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState({ 
    nombre: '', 
    fechaInicio: '', 
    fechaFin: '' 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosRes, categoriasRes] = await Promise.all([
          obtenerProductosHome(),
          obtenerCategorias()
        ]);

        if (productosRes?.data) setProductos(productosRes.data);
        if (categoriasRes?.data) setCategorias(categoriasRes.data);
      } catch (error) {
        console.error('Error cargando datos:', error);
        // No seteamos nada en categorias: se queda como []
      }
    };

    fetchData();
  }, []);

  const buscarProductos = async (e) => {
    e.preventDefault();
    try {
      const res = await buscarProductosPorFiltro(filtro);
      setProductos(res.data || []);
    } catch (error) {
      console.error('Error buscando productos:', error);
    }
  };

  return (
    <div className="home-container">
      <HeroBanner 
        filtro={filtro} 
        setFiltro={setFiltro} 
        buscarProductos={buscarProductos} 
      />

      {/* Sección de categorías siempre se muestra */}
      <CategoryGrid categorias={categorias} />

      <ProductRecommendations productos={productos} />
    </div>
  );
}

export default Home;
