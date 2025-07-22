import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  crearReserva,
  obtenerReservasPorProducto,
  obtenerProductoPorId
} from '../services/api';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import CalendarOcupadas from '../components/CalendarOcupadas';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function ReservaForm() {
  const { id } = useParams(); // productoId
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [form, setForm] = useState({ fechaInicio: '', fechaFin: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setIsLoading(true);
        const [resProducto, resReservas] = await Promise.all([
          obtenerProductoPorId(id),
          obtenerReservasPorProducto(id)
        ]);

        setProducto(resProducto.data);

        // Adaptar formato esperado por CalendarOcupadas
        const fechasAdaptadas = resReservas.data.map((r) => ({
          inicio: r.fechaInicio,
          fin: r.fechaFin
        }));
        setFechasOcupadas(fechasAdaptadas);

      } catch (err) {
        console.error('Error al cargar datos:', err);
        MySwal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la información del producto',
          confirmButtonColor: '#3085d6',
        }).then(() => navigate('/'));
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatos();
  }, [id, navigate]);

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
      MySwal.fire({
        icon: 'warning',
        title: 'Fecha inválida',
        text: 'No puedes reservar fechas pasadas o la actual',
        confirmButtonColor: '#3085d6',
      });
      return false;
    }

    for (let reserva of fechasOcupadas) {
      const existenteInicio = new Date(reserva.inicio);
      const existenteFin = new Date(reserva.fin);

      if (fechasSeTraslapan(nuevaInicio, nuevaFin, existenteInicio, existenteFin)) {
        MySwal.fire({
          icon: 'error',
          title: 'Fechas ocupadas',
          html: `
            <div style="text-align: left;">
              <p>Las fechas seleccionadas coinciden con una reserva existente:</p>
              <p><strong>Desde:</strong> ${existenteInicio.toLocaleDateString()}</p>
              <p><strong>Hasta:</strong> ${existenteFin.toLocaleDateString()}</p>
            </div>
          `,
          confirmButtonColor: '#3085d6',
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!form.fechaInicio || !form.fechaFin) {
      await MySwal.fire({
        icon: 'warning',
        title: 'Faltan fechas',
        text: 'Por favor selecciona ambas fechas',
        confirmButtonColor: '#3085d6',
      });
      setIsSubmitting(false);
      return;
    }

    if (new Date(form.fechaInicio) > new Date(form.fechaFin)) {
      await MySwal.fire({
        icon: 'warning',
        title: 'Fechas inválidas',
        text: 'La fecha de inicio debe ser antes que la de fin',
        confirmButtonColor: '#3085d6',
      });
      setIsSubmitting(false);
      return;
    }

    if (!validarDisponibilidad()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await crearReserva({
        productoId: Number(id),
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin
      });

      await MySwal.fire({
        icon: 'success',
        title: '¡Reserva confirmada!',
        html: `
          <div style="text-align: left;">
            <p>Tu reserva para <strong>${producto.nombre}</strong> ha sido creada exitosamente.</p>
            <p><strong>Fecha de inicio:</strong> ${new Date(form.fechaInicio).toLocaleDateString()}</p>
            <p><strong>Fecha de fin:</strong> ${new Date(form.fechaFin).toLocaleDateString()}</p>
            <p>Recibirás un correo con los detalles de tu reserva.</p>
          </div>
        `,
        confirmButtonColor: '#3085d6',
      });

      navigate('/perfil');
    } catch (err) {
      console.error(err);
      await MySwal.fire({
        icon: 'error',
        title: 'Error al reservar',
        text: err.response?.data?.message || 'No se pudo completar la reserva',
        confirmButtonColor: '#3085d6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando información del producto...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="text-center mt-5">
        <p>No se pudo cargar la información del producto</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Recargar página
        </Button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <Card className="p-4 shadow mx-auto" style={{ maxWidth: '600px' }}>
        <h3 className="mb-4 text-center">Reservar: {producto.nombre}</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de inicio</Form.Label>
            <Form.Control
              type="date"
              name="fechaInicio"
              value={form.fechaInicio}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
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
              min={form.fechaInicio || new Date().toISOString().split('T')[0]}
            />
          </Form.Group>

          <Button 
            variant="success" 
            type="submit" 
            className="w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Procesando...
              </>
            ) : 'Confirmar reserva'}
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