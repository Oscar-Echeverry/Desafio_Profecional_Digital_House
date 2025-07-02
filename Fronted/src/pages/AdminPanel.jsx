import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AdminPanel.module.css";
import {FaUsers,FaTags,FaCogs, FaBoxOpen,FaTrash,FaPlus,FaCheck,FaTimes,FaUserShield,FaUserSlash
} from "react-icons/fa";

const AdminPanel = () => {
  const [esMovil, setEsMovil] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: "", imagen: null });
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState({ nombre: "", icono: "" });
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    categoria: "",
    caracteristicas: []
  });
  const [imagenesProducto, setImagenesProducto] = useState([]);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setEsMovil(isMobile);
  }, []);

  useEffect(() => {
    if (!token) {
      alert("Sesión expirada. Inicia sesión.");
      navigate("/login");
      return;
    }
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [usuariosRes, categoriasRes, caracteristicasRes, productosRes] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/usuarios", config),
        axios.get("http://localhost:8080/api/categorias"),
        axios.get("http://localhost:8080/api/caracteristicas"),
        axios.get("http://localhost:8080/api/productos")
      ]);
      setUsuarios(usuariosRes.data);
      setCategorias(categoriasRes.data);
      setCaracteristicas(caracteristicasRes.data);
      setProductos(productosRes.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const toggleAdmin = async (id, hacerAdmin) => {
    await axios.put(`http://localhost:8080/api/admin/usuarios/${id}/promover?hacerAdmin=${hacerAdmin}`, null, config);
    cargarDatos();
  };

  const toggleActivo = async (id, activo) => {
    await axios.put(`http://localhost:8080/api/admin/usuarios/${id}/bloquear?activo=${activo}`, null, config);
    cargarDatos();
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      await axios.delete(`http://localhost:8080/api/admin/usuarios/${id}`, config);
      cargarDatos();
    }
  };

  const crearCategoria = async () => {
    const formData = new FormData();
    formData.append("categoria", JSON.stringify({
      nombre: nuevaCategoria.nombre,
      descripcion: nuevaCategoria.descripcion
    }));
    formData.append("imagen", nuevaCategoria.imagen);
    await axios.post("http://localhost:8080/api/categorias", formData, config);
    setNuevaCategoria({ nombre: "", descripcion: "", imagen: null });
    cargarDatos();
  };

  const editarCategoria = async () => {
    if (!categoriaEditando) return;
    const formData = new FormData();
    formData.append("categoria", JSON.stringify({
      nombre: categoriaEditando.nombre,
      descripcion: categoriaEditando.descripcion || ""
    }));
    if (categoriaEditando.imagen instanceof File) {
      formData.append("imagen", categoriaEditando.imagen);
    }
    await axios.put(`http://localhost:8080/api/categorias/${categoriaEditando.id}`, formData, config);
    setCategoriaEditando(null);
    cargarDatos();
  };

  const crearCaracteristica = async () => {
    await axios.post("http://localhost:8080/api/caracteristicas", nuevaCaracteristica, config);
    setNuevaCaracteristica({ nombre: "", icono: "" });
    cargarDatos();
  };

  const crearProducto = async () => {
    const formData = new FormData();
    formData.append("producto", JSON.stringify(nuevoProducto));
    imagenesProducto.forEach(img => formData.append("imagenes", img));
    await axios.post("http://localhost:8080/api/productos", formData, config);
    setNuevoProducto({ nombre: "", descripcion: "", direccion: "", categoria: "", caracteristicas: [] });
    setImagenesProducto([]);
    cargarDatos();
  };

  const eliminarCategoria = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      await axios.delete(`http://localhost:8080/api/categorias/${id}`, config);
      cargarDatos();
    }
  };

  const eliminarCaracteristica = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta característica?")) {
      await axios.delete(`http://localhost:8080/api/caracteristicas/${id}`, config);
      cargarDatos();
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      await axios.delete(`http://localhost:8080/api/productos/${id}`, config);
      cargarDatos();
    }
  };

  //  Bloqueo para móviles
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
      <input
        type="text"
        value={nuevaCategoria.nombre}
        onChange={e => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
        placeholder="Nombre"
      />
      <input
        type="text"
        value={nuevaCategoria.descripcion}
        onChange={e => setNuevaCategoria({ ...nuevaCategoria, descripcion: e.target.value })}
        placeholder="Descripción"
      />
      <input
        type="file"
        onChange={e => setNuevaCategoria({ ...nuevaCategoria, imagen: e.target.files[0] })}
      />
      <button onClick={crearCategoria}><FaPlus /> Crear</button>
      <div className={styles.categoriasGrid}>
        {categorias.map(cat => (
          <div key={cat.id} className={styles.categoriaCard}>
            {cat.imagenUrl && (
              <img src={cat.imagenUrl} alt={cat.nombre} className={styles.categoriaImagen} />
            )}
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
        <div style={{ marginTop: "20px" }}>
          <h3>Editar Categoría</h3>
          <input
            type="text"
            value={categoriaEditando.nombre}
            onChange={e => setCategoriaEditando({ ...categoriaEditando, nombre: e.target.value })}
            placeholder="Nuevo nombre"
          />
          <input
            type="text"
            value={categoriaEditando.descripcion || ""}
            onChange={e => setCategoriaEditando({ ...categoriaEditando, descripcion: e.target.value })}
            placeholder="Descripción"
          />
          <input
            type="file"
            onChange={e => setCategoriaEditando({ ...categoriaEditando, imagen: e.target.files[0] })}
          />
          <button onClick={editarCategoria}><FaCheck /> Guardar</button>
          <button onClick={() => setCategoriaEditando(null)}><FaTimes /> Cancelar</button>
        </div>
      )}
      <div className={styles.grid}>
        {caracteristicas.map(car => (
          <div key={car.id} className={styles.card}>
            <h3>{car.nombre}</h3>
            <div className={styles.cardActions}>
              <button onClick={() => eliminarCaracteristica(car.id)}><FaTrash /> Eliminar</button>
            </div>
          </div>
        ))}
      </div>


      <h2><FaBoxOpen /> Productos</h2>
      <input type="text" placeholder="Nombre" value={nuevoProducto.nombre} onChange={e => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} />
      <input type="text" placeholder="Descripción" value={nuevoProducto.descripcion} onChange={e => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })} />
      <input type="text" placeholder="Dirección" value={nuevoProducto.direccion} onChange={e => setNuevoProducto({ ...nuevoProducto, direccion: e.target.value })} />
      <select value={nuevoProducto.categoria} onChange={e => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}>
        <option value="">Selecciona una categoría</option>
        {categorias.map(cat => <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>)}
      </select>
      <div>
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
      <input type="file" multiple onChange={e => setImagenesProducto(Array.from(e.target.files))} />
      <button onClick={crearProducto}><FaPlus /> Crear Producto</button>
      <div className={styles.grid}>
        {productos.map(prod => (
          <div key={prod.id} className={styles.card}>
            <h3>{prod.nombre}</h3>
            <p>{prod.descripcion}</p>
            <div className={styles.cardActions}>
              <button onClick={() => eliminarProducto(prod.id)}><FaTrash /> Eliminar</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminPanel;
