"use client";
import { useEffect, useState } from 'react';

export default function TarjetasPorJornada({ jornadaId }) {
  const [tarjetas, setTarjetas] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/tarjetas/?jornada=${jornadaId}`)
      .then(res => res.json())
      .then(data => setTarjetas(data))
      .catch(err => console.error('Error al cargar tarjetas por jornada:', err));
  }, [jornadaId]);

  return (
    <table className="w-full border mb-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-2 py-1">Jugador</th>
          <th className="border px-2 py-1">Equipo</th>
          <th className="border px-2 py-1">Tipo</th>
          <th className="border px-2 py-1">Partido</th>
          <th className="border px-2 py-1">Fecha</th>
        </tr>
      </thead>
      <tbody>
        {tarjetas.map((t, i) => (
          <tr key={i} className="text-center">
            <td className="border px-2 py-1">{t.participante_nombre || `ID ${t.participante}`}</td>
            <td className="border px-2 py-1">{t.equipo_nombre || '-'}</td>
            <td className="border px-2 py-1">{t.tipo}</td>
            <td className="border px-2 py-1">{t.partido_info || '-'}</td>
            <td className="border px-2 py-1">{t.fecha_registro}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
