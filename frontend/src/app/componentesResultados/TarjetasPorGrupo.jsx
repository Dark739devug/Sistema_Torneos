'use client';

import { useEffect, useState } from 'react';

export default function TarjetasPorGrupo({ grupoId }) {
  const [tarjetas, setTarjetas] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/tarjetas/?grupo=${grupoId}`)
      .then(res => res.json())
      .then(data => setTarjetas(data))
      .catch(err => console.error('Error al cargar tarjetas por grupo:', err));
  }, [grupoId]);

  return (
    <div className="overflow-x-auto">
      <h3 className="text-xl font-semibold text-red-700 mt-6 mb-2">Tarjetas del Grupo</h3>
      <table className="w-full border mb-4">
        <thead className="bg-red-100">
          <tr>
            <th className="border px-2 py-1">Jugador</th>
            <th className="border px-2 py-1">Equipo</th>
            <th className="border px-2 py-1">Tipo</th>
            <th className="border px-2 py-1">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {tarjetas.map((t, i) => (
            <tr key={i} className="text-center">
              <td className="border px-2 py-1">{t.participante_nombre || `ID ${t.participante}`}</td>
              <td className="border px-2 py-1">{t.equipo_nombre || '-'}</td>
              <td className="border px-2 py-1">{t.tipo}</td>
              <td className="border px-2 py-1">{t.fecha_registro}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
