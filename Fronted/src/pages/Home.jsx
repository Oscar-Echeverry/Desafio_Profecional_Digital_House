import React, { useEffect, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import CategoryGrid from '../components/CategoryGrid';
import ProductRecommendations from '../components/ProductRecommendations';

import {
  obtenerProductosHome,
  obtenerCategorias,
  buscarProductosPorFiltro,
  obtenerProductosPorCategoria,
} from '../services/api';

function Home() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filtro, setFiltro] = useState({
    ciudad: '',
    fechaInicio: '',
    fechaFin: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosRes, categoriasRes] = await Promise.all([
          obtenerProductosHome(),
          obtenerCategorias(),
        ]);

        if (productosRes?.data) setProductos(productosRes.data);
        if (categoriasRes?.data) setCategorias(categoriasRes.data);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    fetchData();
  }, []);
  const buscarProductos = async (e) => {
    e.preventDefault();

    if (!filtro.ciudad || !filtro.fechaInicio || !filtro.fechaFin) {
      alert('Completa ciudad y fechas');
      return;
    }

    if (filtro.fechaInicio > filtro.fechaFin) {
      alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }

    try {
      setLoading(true);
      const res = await buscarProductosPorFiltro(filtro);
      setProductos(res.data || []);
    } catch (error) {
      console.error('Error buscando productos:', error);
    } finally {
      setLoading(false);
    }
  };
  const filtrarPorCategoria = async (categoriaId) => {
    try {
      setLoading(true);
      const res = await obtenerProductosPorCategoria(categoriaId);
      setProductos(res.data || []);
    } catch (error) {
      console.error('Error al filtrar por categoría:', error);
    } finally {
      setLoading(false);
    }
  };
  const mostrarTodos = async () => {
    try {
      setLoading(true);
      const res = await obtenerProductosHome();
      setProductos(res.data || []);
    } catch (error) {
      console.error('Error al obtener todos los productos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <HeroBanner
        filtro={filtro}
        setFiltro={setFiltro}
        buscarProductos={buscarProductos}
      />

      <CategoryGrid
        categorias={categorias}
        filtrarPorCategoria={filtrarPorCategoria}
      />

      {loading ? (
        <p className="text-center mt-4">Cargando productos...</p>
      ) : (
        <ProductRecommendations productos={productos} />
      )}
    </div>
  );
}

export default Home;
