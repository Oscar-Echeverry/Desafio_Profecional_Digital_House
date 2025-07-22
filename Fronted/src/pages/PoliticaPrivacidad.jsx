import React from 'react';
import styles from '../styles/PoliticaPrivacidad.module.css';
import { FaShieldAlt, FaUserShield, FaLock, FaSyncAlt, FaInfoCircle } from 'react-icons/fa';

const PoliticaPrivacidad = () => {
  return (
    <main className={`container py-4 ${styles.fondo}`}>
      <section className="bg-white rounded shadow p-4">
        <h1 className="mb-4 text-center">
          <FaShieldAlt className="me-2 text-primary" />
          Política de Privacidad
        </h1>

        <p className="mb-3">
          Tu privacidad es importante para nosotros. Esta política explica cómo
          recopilamos, usamos y protegemos tu información personal cuando utilizas
          nuestro sitio web o nuestros servicios.
        </p>

        <h2 className="mt-4 h5">
          <FaUserShield className="me-2 text-secondary" />
          1. Información que recopilamos
        </h2>
        <p>
          Podemos recopilar información personal como nombre, correo electrónico,
          número de teléfono y otros datos que proporciones voluntariamente.
        </p>

        <h2 className="mt-4 h5">
          <FaInfoCircle className="me-2 text-secondary" />
          2. Uso de la información
        </h2>
        <p>
          Utilizamos tus datos para procesar solicitudes, brindar soporte, mejorar
          nuestros servicios y enviarte información relevante si lo autorizas.
        </p>

        <h2 className="mt-4 h5">
          <FaLock className="me-2 text-secondary" />
          3. Protección de datos
        </h2>
        <p>
          Aplicamos medidas de seguridad técnicas y organizativas para proteger tus datos
          contra accesos no autorizados, pérdidas o alteraciones.
        </p>

        <h2 className="mt-4 h5">
          <FaUserShield className="me-2 text-secondary" />
          4. Tus derechos
        </h2>
        <p>
          Puedes acceder, corregir o eliminar tus datos personales en cualquier momento
          comunicándote con nosotros.
        </p>

        <h2 className="mt-4 h5">
          <FaSyncAlt className="me-2 text-secondary" />
          5. Cambios a esta política
        </h2>
        <p>
          Esta política puede actualizarse. Notificaremos los cambios importantes
          publicando una nueva versión en esta página.
        </p>

        <p className="mt-4">
          Si tienes preguntas, contáctanos a través de nuestros canales de atención.
        </p>
      </section>
    </main>
  );
};

export default PoliticaPrivacidad;
