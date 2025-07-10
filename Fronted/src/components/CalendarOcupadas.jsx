import React from 'react';
import { Calendar } from 'react-date-range';
import { parseISO, isWithinInterval, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const CalendarOcupadas = ({ fechasOcupadas = [] }) => {
  // Función para deshabilitar días ocupados
  const isDisabled = (date) => {
    return fechasOcupadas.some(({ inicio, fin }) => {
      if (!inicio || !fin) return false;

      const start = parseISO(inicio);
      const end = parseISO(fin);

      if (!isValid(start) || !isValid(end)) return false;

      return isWithinInterval(date, { start, end });
    });
  };

  return (
    <div className="d-flex justify-content-center">
      <Calendar
        date={new Date()}
        disabledDay={isDisabled}
        locale={es}
        color="#198754" 
      />
    </div>
  );
};

export default CalendarOcupadas;
