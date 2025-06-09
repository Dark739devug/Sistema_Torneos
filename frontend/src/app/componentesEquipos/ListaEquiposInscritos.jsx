'use client';

import React from 'react';

export default function ListaEquiposInscritos({ equipos, inscripciones, estadosInscripcion }) {
  // Filtrar los equipos que tienen inscripciones
  const equiposInscritos = equipos.filter(equipo => inscripciones[equipo.id]);

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h2>Lista de Equipos Inscritos</h2>
      {equiposInscritos.length === 0 ? (
        <p>No hay equipos que hayan enviado su inscripción.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {equiposInscritos.map(equipo => (
            <li
              key={equipo.id}
              style={{
                marginBottom: '0.5rem',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{equipo.nombre_equipo}</span>
              <span style={{ fontWeight: 'bold', color: getEstadoColor(estadosInscripcion[equipo.id]) }}>
                {estadosInscripcion[equipo.id]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const getEstadoColor = (estado) => {
  switch (estado) {
    case 'Aprobada':
      return 'green';
    case 'Pendiente':
      return 'orange';
    case 'Rechazada':
      return 'red';
    default:
      return 'black';
  }
};
