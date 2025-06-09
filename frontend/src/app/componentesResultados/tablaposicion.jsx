'use client';

import { useEffect, useState } from 'react';

export default function TablaPosicionesGeneral({ torneoId }) {
  const [tabla, setTabla] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/tabla-posiciones/?torneo=${torneoId}`)
      .then(res => res.json())
      .then(data => setTabla(data))
      .catch(err => console.error('Error al cargar la tabla de posiciones:', err));
  }, [torneoId]);

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Tabla de Posiciones General</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Equipo</th>
            <th className="border px-2 py-1">PJ</th>
            <th className="border px-2 py-1">G</th>
            <th className="border px-2 py-1">E</th>
            <th className="border px-2 py-1">P</th>
            <th className="border px-2 py-1">GF</th>
            <th className="border px-2 py-1">GC</th>
            <th className="border px-2 py-1">Puntos</th>
          </tr>
        </thead>
        <tbody>
          {tabla.map((fila, i) => (
            <tr key={i} className="text-center">
              <td className="border px-2 py-1">{fila.equipo_nombre || `Equipo ${fila.equipo}`}</td>
              <td className="border px-2 py-1">{fila.partidos_jugados}</td>
              <td className="border px-2 py-1">{fila.ganados}</td>
              <td className="border px-2 py-1">{fila.empatados}</td>
              <td className="border px-2 py-1">{fila.perdidos}</td>
              <td className="border px-2 py-1">{fila.goles_favor}</td>
              <td className="border px-2 py-1">{fila.goles_contra}</td>
              <td className="border px-2 py-1 font-bold">{fila.puntos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
