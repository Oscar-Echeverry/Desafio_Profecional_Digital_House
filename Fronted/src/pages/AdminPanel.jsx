import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AdminPanel.module.css";
import {
  FaUsers, FaTags, FaCogs, FaBoxOpen, FaTrash, FaPlus, FaCheck, FaTimes, FaUserShield, FaUserSlash
} from "react-icons/fa";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import * as FaIcons from "react-icons/fa";
import { getIconComponent } from '../utils/iconUtils';
import api from '../services/api';

const MySwal = withReactContent(Swal);

const AdminPanel = () => {
  const [esMovil, setEsMovil] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "", imagen: null, descripcion: "" });
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState({ nombre: "", icono: "" });
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    ciudad: "",
    categoria: "",
    caracteristicas: [],
    politicas: []
  });
  const [imagenesProducto, setImagenesProducto] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setEsMovil(isMobile);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      MySwal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Inicia sesión para continuar.',
        confirmButtonColor: '#3085d6',
      }).then(() => navigate("/login"));
      return;
    }
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [usuariosRes, categoriasRes, caracteristicasRes, productosRes] = await Promise.all([
        api.get('/admin/usuarios'),
        api.get('/categorias'),
        api.get('/caracteristicas'),
        api.get('/productos')
      ]);
      setUsuarios(usuariosRes.data);
      setCategorias(categoriasRes.data);
      setCaracteristicas(caracteristicasRes.data);
      setProductos(productosRes.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los datos',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const toggleAdmin = async (id, hacerAdmin) => {
    try {
      await api.put(`/admin/usuarios/${id}/promover?hacerAdmin=${hacerAdmin}`);
      cargarDatos();
      MySwal.fire({
        icon: 'success',
        title: 'Éxito',
        text: `Usuario ${hacerAdmin ? 'promovido a admin' : 'degradado a usuario'}`,
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al cambiar rol',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const toggleActivo = async (id, activo) => {
    try {
      await api.put(`/admin/usuarios/${id}/bloquear?activo=${activo}`);
      cargarDatos();
      MySwal.fire({
        icon: 'success',
        title: 'Éxito',
        text: `Usuario ${activo ? 'activado' : 'desactivado'}`,
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al cambiar estado',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const eliminarUsuario = async (id) => {
    const result = await MySwal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/usuarios/${id}`);
        cargarDatos();
        MySwal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El usuario ha sido eliminado',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Error al eliminar usuario',
          confirmButtonColor: '#3085d6',
        });
      }
    }
  };

  const crearCategoria = async () => {
    try {
      const formData = new FormData();
      formData.append("categoria", JSON.stringify({
        nombre: nuevaCategoria.nombre,
        descripcion: nuevaCategoria.descripcion
      }));
      formData.append("imagen", nuevaCategoria.imagen);
      
      await api.post('/categorias', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setNuevaCategoria({ nombre: "", descripcion: "", imagen: null });
      cargarDatos();
      
      MySwal.fire({
        icon: 'success',
        title: 'Categoría creada',
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al crear categoría',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const editarCategoria = async () => {
    if (!categoriaEditando) return;
    
    try {
      const formData = new FormData();
      formData.append("categoria", JSON.stringify({
        nombre: categoriaEditando.nombre,
        descripcion: categoriaEditando.descripcion || ""
      }));
      if (categoriaEditando.imagen instanceof File) {
        formData.append("imagen", categoriaEditando.imagen);
      }
      
      await api.put(`/categorias/${categoriaEditando.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setCategoriaEditando(null);
      cargarDatos();
      
      MySwal.fire({
        icon: 'success',
        title: 'Categoría actualizada',
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al actualizar categoría',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const crearCaracteristica = async () => {
    try {
      await api.post('/caracteristicas', nuevaCaracteristica);
      setNuevaCaracteristica({ nombre: "", icono: "" });
      cargarDatos();
      
      MySwal.fire({
        icon: 'success',
        title: 'Característica creada',
        confirmButtonColor: '#3085d6',
      });
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al crear característica',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const guardarProducto = async () => {
    try {
      const formData = new FormData();
      const productoData = modoEdicion ? {
        ...nuevoProducto,
        id: productoEditando.id
      } : nuevoProducto;

      const politicasTransformadas = productoData.politicas.map(p => ({
        titulo: p.tipo || p.titulo,
        descripcion: p.descripcion
      }));

      formData.append("producto", JSON.stringify({
        ...productoData,
        politicas: politicasTransformadas
      }));

      imagenesProducto.forEach(img => formData.append("imagenes", img));

      if (modoEdicion) {
        await api.put(
          `/productos/${productoEditando.id}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        
        MySwal.fire({
          icon: 'success',
          title: 'Producto actualizado',
          confirmButtonColor: '#3085d6',
        });
      } else {
        await api.post(
          '/productos',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        
        MySwal.fire({
          icon: 'success',
          title: 'Producto creado',
          confirmButtonColor: '#3085d6',
        });
      }

      // Resetear estados
      setNuevoProducto({
        nombre: "",
        descripcion: "",
        direccion: "",
        ciudad: "",
        categoria: "",
        caracteristicas: [],
        politicas: []
      });
      setImagenesProducto([]);
      setProductoEditando(null);
      setModoEdicion(false);
      cargarDatos();

    } catch (error) {
      console.error("Error al guardar producto:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al guardar producto',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const iniciarEdicionProducto = (producto) => {
    setProductoEditando(producto);
    setModoEdicion(true);
    setNuevoProducto({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      direccion: producto.direccion,
      ciudad: producto.ciudad,
      categoria: producto.categoria,
      caracteristicas: [...producto.caracteristicas],
      politicas: producto.politicas.map(p => ({
        tipo: p.titulo,
        descripcion: p.descripcion
      }))
    });
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setProductoEditando(null);
    setNuevoProducto({
      nombre: "",
      descripcion: "",
      direccion: "",
      ciudad: "",
      categoria: "",
      caracteristicas: [],
      politicas: []
    });
    setImagenesProducto([]);
  };

  const eliminarCategoria = async (id) => {
    const result = await MySwal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/categorias/${id}`);
        cargarDatos();
        MySwal.fire({
          icon: 'success',
          title: 'Eliminada',
          text: 'La categoría ha sido eliminada',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Error al eliminar categoría',
          confirmButtonColor: '#3085d6',
        });
      }
    }
  };

  const eliminarCaracteristica = async (id) => {
    const result = await MySwal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/caracteristicas/${id}`);
        cargarDatos();
        MySwal.fire({
          icon: 'success',
          title: 'Eliminada',
          text: 'La característica ha sido eliminada',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Error al eliminar característica',
          confirmButtonColor: '#3085d6',
        });
      }
    }
  };

  const eliminarProducto = async (id) => {
    const result = await MySwal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/productos/${id}`);
        cargarDatos();
        MySwal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El producto ha sido eliminado',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Error al eliminar producto',
          confirmButtonColor: '#3085d6',
        });
      }
    }
  };

  if (esMovil) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>⚠️ Acceso restringido</h2>
        <p>El panel de administración no está disponible desde dispositivos móviles.</p>
      </div>
    );
  }

  return (
    <div className={styles.adminPanel}>
      <h2><FaUsers /> Usuarios</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Verificado</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(user => (
            <tr key={user.id}>
              <td>{user.nombre} {user.apellido}</td>
              <td>{user.email}</td>
              <td>{user.rol}</td>
              <td>{user.verificado ? "✔️" : "❌"}</td>
              <td>{user.activo ? "✔️" : "❌"}</td>
              <td>
                <button onClick={() => toggleAdmin(user.id, user.rol !== "ADMIN")}>
                  {user.rol === "ADMIN" ? <><FaUserSlash /> Quitar Admin</> : <><FaUserShield /> Hacer Admin</>}
                </button>
                <button onClick={() => toggleActivo(user.id, !user.activo)}>
                  {user.activo ? <><FaTimes /> Desactivar</> : <><FaCheck /> Activar</>}
                </button>
                <button onClick={() => eliminarUsuario(user.id)}><FaTrash /> Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2><FaTags /> Categorías</h2>
      <input type="text" placeholder="Nombre" value={nuevaCategoria.nombre} onChange={e => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })} />
      <input type="text" placeholder="Descripción" value={nuevaCategoria.descripcion} onChange={e => setNuevaCategoria({ ...nuevaCategoria, descripcion: e.target.value })} />
      <input type="file" onChange={e => setNuevaCategoria({ ...nuevaCategoria, imagen: e.target.files[0] })} />
      <button onClick={crearCategoria}><FaPlus /> Crear</button>

      <div className={styles.categoriasGrid}>
        {categorias.map(cat => (
          <div key={cat.id} className={styles.categoriaCard}>
            {cat.imagenUrl && <img src={cat.imagenUrl} alt={cat.nombre} className={styles.categoriaImagen} />}
            <div className={styles.categoriaInfo}>
              <h3>{cat.nombre}</h3>
              <p>{cat.descripcion}</p>
              <div className={styles.cardActions}>
                <button onClick={() => eliminarCategoria(cat.id)}><FaTrash /> Eliminar</button>
                <button onClick={() => setCategoriaEditando({ ...cat })}><FaCogs /> Editar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categoriaEditando && (
        <div>
          <h3>Editar Categoría</h3>
          <input type="text" value={categoriaEditando.nombre} onChange={e => setCategoriaEditando({ ...categoriaEditando, nombre: e.target.value })} />
          <input type="text" value={categoriaEditando.descripcion || ""} onChange={e => setCategoriaEditando({ ...categoriaEditando, descripcion: e.target.value })} />
          <input type="file" onChange={e => setCategoriaEditando({ ...categoriaEditando, imagen: e.target.files[0] })} />
          <button onClick={editarCategoria}><FaCheck /> Guardar</button>
          <button onClick={() => setCategoriaEditando(null)}><FaTimes /> Cancelar</button>
        </div>
      )}

      <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
        <FaCogs /> Características
      </h2>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Icono (ej: FaParking)</th>
              <th className={styles.smallColumn}></th>
            </tr>
          </thead>
          <tbody>
            {caracteristicas.map(car => {
              const IconComponent = getIconComponent(car.icono);
              return (
                <tr key={car.id} className={styles.tableRow}>
                  <td>{car.nombre}</td>
                  <td className={styles.iconCell}>
                    {IconComponent ? <IconComponent className={styles.icon} /> : <FaIcons.FaQuestionCircle className={styles.icon} />}
                    <span>{car.icono}</span>
                  </td>
                  <td className={styles.deleteCell}>
                    <button onClick={() => eliminarCaracteristica(car.id)} className={styles.btnEliminar} title="Eliminar">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr className={styles.formRow}>
              <td>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={nuevaCaracteristica.nombre}
                  onChange={e => setNuevaCaracteristica({ ...nuevaCaracteristica, nombre: e.target.value })}
                  className={styles.inputField}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="Icono (ej: FaParking)"
                  value={nuevaCaracteristica.icono}
                  onChange={e => setNuevaCaracteristica({ ...nuevaCaracteristica, icono: e.target.value })}
                  className={styles.inputField}
                />
              </td>
              <td>
                <button onClick={crearCaracteristica} className={styles.btnCrear}>
                  <FaPlus /> Crear
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2><FaBoxOpen /> Productos</h2>
      <div className={styles.productoForm}>
        <h3>{modoEdicion ? "Editar Producto" : "Crear Nuevo Producto"}</h3>

        <input
          type="text"
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={e => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
        />

        <input
          type="text"
          placeholder="Descripción"
          value={nuevoProducto.descripcion}
          onChange={e => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
        />

        <input
          type="text"
          placeholder="Dirección"
          value={nuevoProducto.direccion}
          onChange={e => setNuevoProducto({ ...nuevoProducto, direccion: e.target.value })}
        />

        <input
          type="text"
          placeholder="Ciudad"
          value={nuevoProducto.ciudad}
          onChange={e => setNuevoProducto({ ...nuevoProducto, ciudad: e.target.value })}
        />

        <select
          value={nuevoProducto.categoria}
          onChange={e => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map(cat => <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>)}
        </select>

        <div className={styles.caracteristicasContainer}>
          <h4>Características</h4>
          {caracteristicas.map(c => (
            <label key={c.id}>
              <input
                type="checkbox"
                value={c.nombre}
                checked={nuevoProducto.caracteristicas.includes(c.nombre)}
                onChange={e => {
                  const checked = e.target.checked;
                  setNuevoProducto(prev => ({
                    ...prev,
                    caracteristicas: checked
                      ? [...prev.caracteristicas, c.nombre]
                      : prev.caracteristicas.filter(n => n !== c.nombre)
                  }));
                }}
              />
              {c.nombre}
            </label>
          ))}
        </div>

        <div className={styles.politicasContainer}>
          <h4>Políticas</h4>
          {nuevoProducto.politicas.map((p, idx) => (
            <div key={idx} className={styles.politicaItem}>
              <input
                list="tiposPolitica"
                placeholder="Tipo de política"
                value={p.tipo || ""}
                onChange={e => {
                  const updated = [...nuevoProducto.politicas];
                  updated[idx].tipo = e.target.value;
                  setNuevoProducto({ ...nuevoProducto, politicas: updated });
                }}
              />

              <datalist id="tiposPolitica">
                <option value="Normas" />
                <option value="Salud y seguridad" />
                <option value="Política de cancelación" />
              </datalist>
              <input
                type="text"
                value={p.descripcion}
                onChange={e => {
                  const updated = [...nuevoProducto.politicas];
                  updated[idx].descripcion = e.target.value;
                  setNuevoProducto({ ...nuevoProducto, politicas: updated });
                }}
              />
              <button
                onClick={() => {
                  const updated = nuevoProducto.politicas.filter((_, i) => i !== idx);
                  setNuevoProducto({ ...nuevoProducto, politicas: updated });
                }}
              >
                ❌
              </button>
            </div>
          ))}
          <button
            onClick={() => setNuevoProducto({
              ...nuevoProducto,
              politicas: [...nuevoProducto.politicas, { tipo: "", descripcion: "" }]
            })}
          >
            ➕ Añadir política
          </button>
        </div>

        <input
          type="file"
          multiple
          onChange={e => setImagenesProducto(Array.from(e.target.files))}
        />

        <div className={styles.formActions}>
          {modoEdicion ? (
            <>
              <button onClick={guardarProducto}><FaCheck /> Guardar Cambios</button>
              <button onClick={cancelarEdicion}><FaTimes /> Cancelar</button>
            </>
          ) : (
            <button onClick={guardarProducto}><FaPlus /> Crear Producto</button>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {productos.map(prod => (
          <div key={prod.id} className={styles.card}>
            <h3>{prod.nombre}</h3>
            <p>{prod.descripcion}</p>
            <div className={styles.cardActions}>
              <button onClick={() => eliminarProducto(prod.id)}><FaTrash /> Eliminar</button>
              <button onClick={() => iniciarEdicionProducto(prod)}><FaCogs /> Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;