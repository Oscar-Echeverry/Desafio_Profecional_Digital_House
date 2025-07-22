import axios from 'axios';

const API_URL = 'https://tripnest.duckdns.org//api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo de errores global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      console.error(`API Error [${status}]:`, data.message || data);

      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioId');
      }

      return Promise.reject({
        status,
        message: data.message || 'Ocurrió un error en la solicitud.',
      });
    }
    return Promise.reject({
      status: 0,
      message: 'No se pudo conectar con el servidor.',
    });
  }
);


// Autenticación
export const registrarUsuario = (data) => api.post('/auth/registro', data);

export const loginUsuario = (credentials) => api.post('/auth/login', credentials);

export const confirmarCuenta = (token) =>
  api.get(`/auth/confirmar?token=${encodeURIComponent(token)}`);

// Perfil de usuario
export const obtenerPerfil = () => api.get('/usuarios/me');

export const actualizarDatos = (id, data) => {
  const params = new URLSearchParams();
  params.append('nombre', data.nombre);
  params.append('apellido', data.apellido);

  return api.put(`/usuarios/${id}/datos`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export const cambiarPassword = (id, data) => {
  const params = new URLSearchParams();
  params.append('nuevaPassword', data.nueva);

  return api.put(`/usuarios/${id}/password`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export const cambiarImagen = (id, imagenFile) => {
  const formData = new FormData();
  formData.append('imagen', imagenFile);

  return api.put(`/usuarios/${id}/imagen`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Recuperación de contraseña
export const recuperarPassword = (email) =>
  api.post(`/auth/recuperar?email=${encodeURIComponent(email)}`);

export const resetearPassword = (token, nuevaPassword) => {
  const params = new URLSearchParams();
  params.append('token', token);
  params.append('nuevaPassword', nuevaPassword);

  return api.post('/auth/resetear', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

// Productos y Categorías
export const obtenerProductos = () => api.get('/productos');
export const obtenerProductosPorCategoria = (categoriaId) =>
  api.get(`/productos/categoria/${categoriaId}`);
export const obtenerProductosHome = () => api.get('/productos/home');
export const obtenerCategorias = () => api.get('/categorias');
export const buscarProductosPorFiltro = ({ ciudad, fechaInicio, fechaFin }) => {
  const params = {
    ciudad,
    fechaInicio,
    fechaFin,
  };
  return api.get('/productos/disponibles', { params });
};

// Características del producto
export const obtenerCaracteristicas = () => api.get('/caracteristicas');
export const crearCaracteristica = (data) => api.post('/caracteristicas', data);
export const eliminarCaracteristica = (id) => api.delete(`/caracteristicas/${id}`);
export const editarCaracteristica = (id, data) => api.put(`/caracteristicas/${id}`, data);

// Categorías

export const crearCategoria = (data) => api.post('/categorias', data);
export const eliminarCategoria = (id) => api.delete(`/categorias/${id}`);
export const editarCategoria = (id, data) => api.put(`/categorias/${id}`, data);
// Administración de usuarios
export const listarUsuarios = () => api.get('/usuarios');
export const asignarRolAdmin = (id) => api.put(`/usuarios/${id}/rol?rol=ADMIN`);
export const removerRolAdmin = (id) => api.put(`/usuarios/${id}/rol?rol=USER`);
export const bloquearUsuario = (id) => api.put(`/usuarios/${id}/estado?activo=false`);
export const activarUsuario = (id) => api.put(`/usuarios/${id}/estado?activo=true`);
export const eliminarUsuario = (id) => api.delete(`/usuarios/${id}`);
export const crearProducto = (data) => api.post('/productos', data);
export const editarProducto = (id, data) => api.put(`/productos/${id}`, data);
export const eliminarProducto = (id) => api.delete(`/productos/${id}`);
// Favoritos
export const obtenerProductoPorId = (id) => api.get(`/productos/${id}`);
export const obtenerFavoritos = (usuarioId) =>
  api.get(`/favoritos/${usuarioId}`);
export const agregarFavorito = (usuarioId, productoId) =>
  api.post(`/favoritos/${usuarioId}/${productoId}`);
export const eliminarFavorito = (usuarioId, productoId) =>
  api.delete(`/favoritos/${usuarioId}/${productoId}`);
// Reserva
export const obtenerReservasPorProducto = (productoId) =>
  api.get(`/reservas/producto/${productoId}`);
export const crearReserva = ({ productoId, fechaInicio, fechaFin }) =>
  api.post('/reservas', {
    productoId,
    fechaInicio,
    fechaFin,
  });
export const obtenerMisReservas = () => {
  return api.get('/reservas/mias');
};
export const cancelarReserva = (reservaId) => {
  return api.delete(`/reservas/${reservaId}`);
};
// Valorar
export const valorarProducto = async (productoId, puntuacion, comentario, usuarioId) => {
  try {
    if (puntuacion < 1 || puntuacion > 5) {
      throw new Error('La puntuación debe estar entre 1 y 5');
    }
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Usuario no autenticado');
    }
    const params = new URLSearchParams();
    params.append('puntuacion', puntuacion);
    if (comentario) params.append('comentario', comentario);
    params.append('usuarioId', usuarioId);

    const response = await api.post(`/productos/${productoId}/valorar`, params, {
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al valorar producto:', {
      productoId,
      error: error.response?.data || error.message
    });
    if (error.response?.status === 403) {
      throw new Error('No tienes permiso para valorar este producto');
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuarioId');
      throw new Error('Sesión expirada. Por favor inicia sesión nuevamente');
    }
    
    throw error;
  }
};

export const obtenerValoracionesProducto = async (productoId) => {
  try {
    const response = await api.get(`/productos/${productoId}/valoraciones`);
    return {
      valoraciones: Array.isArray(response.data) ? response.data : [],
      promedio: response.data.promedio || 0,
      total: response.data.total || response.data.length || 0
    };
  } catch (error) {
    console.error('Error al obtener valoraciones:', error);
    return {
      valoraciones: [],
      promedio: 0,
      total: 0
    };
  }
};

export const puedeValorarProducto = async (productoId, usuarioId) => {
  try {
    const response = await api.get(`/productos/${productoId}/puede-valorar`, {
      params: { usuarioId }
    });
    return response.data.puedeValorar;
  } catch (error) {
    console.error('Error al verificar si puede valorar:', error);
    return false;
  }
};

export default api;