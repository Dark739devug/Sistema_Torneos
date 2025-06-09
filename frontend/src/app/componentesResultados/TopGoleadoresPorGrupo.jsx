import { useEffect, useState } from 'react';

export default function TopGoleadoresPorGrupo({ grupoId }) {
  const [goleadores, setGoleadores] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/goleadores/?grupo=${grupoId}`)
      .then(res => res.json())
      .then(data => setGoleadores(data))
      .catch(err => console.error('Error al cargar goleadores por grupo:', err));
  }, [grupoId]);

  return (
    <table className="w-full border mb-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-2 py-1">Jugador</th>
          <th className="border px-2 py-1">Equipo</th>
          <th className="border px-2 py-1">Goles</th>
        </tr>
      </thead>
      <tbody>
        {goleadores.map((g, i) => (
          <tr key={i} className="text-center">
            <td className="border px-2 py-1">{g.participante_nombre || `ID ${g.participante}`}</td>
            <td className="border px-2 py-1">{g.equipo_nombre || '-'}</td>
            <td className="border px-2 py-1 font-bold">{g.goles}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
