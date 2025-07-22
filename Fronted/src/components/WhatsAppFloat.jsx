import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const WhatsAppFloat = ({
  phoneNumber = '57320689293',
  message = 'Hola, tengo una consulta sobre un producto. es solo prueba no enviar',
  color = '#25D366',
  zIndex = 1000,
}) => {
  const handleClick = async (e) => {
    e.preventDefault();

    const result = await MySwal.fire({
      title: '¿Deseás abrir WhatsApp?',
      html: (
        <>
          <p>Al continuar, aceptás nuestra</p>
          <a
            href="/privacidad"
            style={{ color: '#007BFF', textDecoration: 'underline' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            política de privacidad
          </a>
        </>
      ),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#25D366',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(e);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        zIndex: zIndex,
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 56,
          height: 56,
          backgroundColor: color,
          borderRadius: '50%',
          color: 'white',
          fontSize: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
        }}
        aria-label="Chatea por WhatsApp"
        title="Habla con el proveedor"
      >
        <FaWhatsapp />
      </div>
    </div>
  );
};

export default WhatsAppFloat;
