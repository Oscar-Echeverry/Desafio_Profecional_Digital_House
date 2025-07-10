import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  crearReserva,
  obtenerReservasPorProducto,
  obtenerProductoPorId
} from '../services/api';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import CalendarOcupadas from '../components/CalendarOcupadas';

function ReservaForm() {
  const { id } = useParams(); // productoId
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [form, setForm] = useState({ fechaInicio: '', fechaFin: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resProducto = await obtenerProductoPorId(id);
        setProducto(resProducto.data);

        const resReservas = await obtenerReservasPorProducto(id);

        // 🔁 Adaptar formato esperado por CalendarOcupadas
        const fechasAdaptadas = resReservas.data.map((r) => ({
          inicio: r.fechaInicio,
          fin: r.fechaFin
        }));
        setFechasOcupadas(fechasAdaptadas);

      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos del producto o reservas.');
      }
    };

    cargarDatos();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const fechasSeTraslapan = (inicio1, fin1, inicio2, fin2) => {
    return inicio1 <= fin2 && fin1 >= inicio2;
  };

  const validarDisponibilidad = () => {
    const nuevaInicio = new Date(form.fechaInicio);
    const nuevaFin = new Date(form.fechaFin);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Ignorar hora

    if (nuevaInicio < hoy || nuevaFin < hoy) {
      setError('No puedes reservar fechas pasadas.');
      return false;
    }

    for (let reserva of fechasOcupadas) {
      const existenteInicio = new Date(reserva.inicio);
      const existenteFin = new Date(reserva.fin);

      if (fechasSeTraslapan(nuevaInicio, nuevaFin, existenteInicio, existenteFin)) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión para reservar');
      return;
    }

    if (!form.fechaInicio || !form.fechaFin) {
      setError('Por favor selecciona ambas fechas');
      return;
    }

    if (new Date(form.fechaInicio) > new Date(form.fechaFin)) {
      setError('La fecha de inicio debe ser antes que la de fin');
      return;
    }

    if (!validarDisponibilidad()) {
      if (!error) setError('Las fechas seleccionadas están ocupadas');
      return;
    }

    try {
      await crearReserva({
        productoId: Number(id),
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin
      });

      setSuccess('Reserva creada exitosamente');
      setTimeout(() => navigate('/perfil'), 2000);
    } catch (err) {
      console.error(err);
      setError('Error al crear la reserva');
    }
  };

  if (!producto) return <div className="text-center mt-5">Cargando producto...</div>;

  return (
    <div className="container my-5">
      <Card className="p-4 shadow mx-auto" style={{ maxWidth: '600px' }}>
        <h3 className="mb-4 text-center">Reservar: {producto.nombre}</h3>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de inicio</Form.Label>
            <Form.Control
              type="date"
              name="fechaInicio"
              value={form.fechaInicio}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de fin</Form.Label>
            <Form.Control
              type="date"
              name="fechaFin"
              value={form.fechaFin}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100">
            Confirmar reserva
          </Button>
        </Form>

        <div className="mt-4">
          <h5>Disponibilidad</h5>
          <p className="text-muted">
            Las fechas bloqueadas en gris ya están reservadas.
          </p>
          <CalendarOcupadas fechasOcupadas={fechasOcupadas} />
        </div>
      </Card>
    </div>
  );
}

export default ReservaForm;
