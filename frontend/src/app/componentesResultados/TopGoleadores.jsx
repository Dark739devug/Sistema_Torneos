'use client';
import { useEffect, useState } from 'react';

export default function TopGoleadores({ torneoId }) {
  const [goleadores, setGoleadores] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/goleadores/?torneo=${torneoId}`)
      .then((res) => res.json())
      .then((data) => setGoleadores(data))
      .catch((err) => console.error('Error al cargar goleadores:', err));
  }, [torneoId]);

  return (
    <div className="p-4 bg-white rounded shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Top Goleadores</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Jugador</th>
            <th className="border px-2 py-1">Equipo</th>
            <th className="border px-2 py-1">Goles</th>
          </tr>
        </thead>
        <tbody>
          {goleadores.map((g, index) => (
            <tr key={index} className="text-center">
              <td className="border px-2 py-1">{g.participante_nombre || `Participante ${g.participante}`}</td>
              <td className="border px-2 py-1">{g.equipo_nombre || '-'}</td>
              <td className="border px-2 py-1 font-bold">{g.goles}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
