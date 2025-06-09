'use client';

import { useEffect, useState } from 'react';

export default function TablaPosicionesPorGrupo({ grupoId }) {
  const [tabla, setTabla] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/tabla-posiciones/?grupo=${grupoId}`)
      .then(res => res.json())
      .then(data => setTabla(data))
      .catch(err => console.error('Error al cargar la tabla por grupo:', err));
  }, [grupoId]);

  return (
    <div className="overflow-x-auto border border-green-400 rounded-md mb-6">
      <h3 className="text-xl font-semibold text-green-700 p-2 bg-green-100">Tabla del Grupo</h3>
      <table className="w-full text-sm">
        <thead className="bg-green-200">
          <tr>
            <th className="border px-2 py-1">Equipo</th>
            <th className="border px-2 py-1">PJ</th>
            <th className="border px-2 py-1">G</th>
            <th className="border px-2 py-1">E</th>
            <th className="border px-2 py-1">P</th>
            <th className="border px-2 py-1">GF</th>
            <th className="border px-2 py-1">GC</th>
            <th className="border px-2 py-1">Pts</th>
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
