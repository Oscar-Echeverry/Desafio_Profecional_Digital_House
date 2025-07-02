import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// Autenticación

export const registrarUsuario = (data) => api.post('/auth/registro', data);

export const loginUsuario = (credentials) => api.post('/auth/login', credentials);

export const confirmarCuenta = (token) =>
  api.get(`/auth/confirmar?token=${encodeURIComponent(token)}`);


// Usuario
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


// 🛒 Productos y Categorías
export const obtenerProductos = () => api.get('/productos');

export const obtenerProductosHome = () => api.get('/productos/home');

export const buscarProductosPorFiltro = (filtros) => {
  const query = new URLSearchParams();
  if (filtros.nombre) query.append('nombre', filtros.nombre);
  if (filtros.fechaInicio) query.append('fechaInicio', `${filtros.fechaInicio}T00:00:00`);
  if (filtros.fechaFin) query.append('fechaFin', `${filtros.fechaFin}T23:59:59`);
  return api.get(`/productos/buscar?${query.toString()}`);
};

export const obtenerCategorias = () => api.get('/categorias');


//  Características del producto

export const obtenerCaracteristicas = () => api.get('/caracteristicas');

export const crearCaracteristica = (data) => api.post('/caracteristicas', data);

export const eliminarCaracteristica = (id) => api.delete(`/caracteristicas/${id}`);

export const editarCaracteristica = (id, data) => api.put(`/caracteristicas/${id}`, data);


//  Categorías

export const crearCategoria = (data) => api.post('/categorias', data);

export const eliminarCategoria = (id) => api.delete(`/categorias/${id}`);

export const editarCategoria = (id, data) => api.put(`/categorias/${id}`, data);


//  Usuarios y administración

export const listarUsuarios = () => api.get('/usuarios');

export const asignarRolAdmin = (id) => api.put(`/usuarios/${id}/rol?rol=ADMIN`);

export const removerRolAdmin = (id) => api.put(`/usuarios/${id}/rol?rol=USER`);

export const bloquearUsuario = (id) => api.put(`/usuarios/${id}/estado?activo=false`);

export const activarUsuario = (id) => api.put(`/usuarios/${id}/estado?activo=true`);

export const eliminarUsuario = (id) => api.delete(`/usuarios/${id}`);


// Productos

export const crearProducto = (data) => api.post('/productos', data);

export const editarProducto = (id, data) => api.put(`/productos/${id}`, data);

export const eliminarProducto = (id) => api.delete(`/productos/${id}`);

export const obtenerProductoPorId = (id) => api.get(`/productos/${id}`);
