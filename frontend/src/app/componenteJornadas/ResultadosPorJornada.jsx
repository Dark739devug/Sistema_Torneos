import { useEffect, useState } from 'react';

export default function ResultadosPorJornada({ jornadaId }) {
  const [partidos, setPartidos] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/partidos/?jornada=${jornadaId}`)
      .then((res) => res.json())
      .then((data) => setPartidos(data))
      .catch((err) => console.error('Error al cargar los partidos:', err));
  }, [jornadaId]);

  return (
    <table className="w-full border mb-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-2 py-1">Fecha</th>
          <th className="border px-2 py-1">Equipo Local</th>
          <th className="border px-2 py-1">Goles</th>
          <th className="border px-2 py-1">Equipo Visitante</th>
          <th className="border px-2 py-1">Goles</th>
        </tr>
      </thead>
      <tbody>
        {partidos.map((p, index) => (
          <tr key={index} className="text-center">
            <td className="border px-2 py-1">{p.fecha_partido}</td>
            <td className="border px-2 py-1">{p.equipo_local_nombre || `Equipo ${p.equipo_local}`}</td>
            <td className="border px-2 py-1">{p.resultado?.find(r => r.equipo === p.equipo_local)?.goles_equipo ?? '-'}</td>
            <td className="border px-2 py-1">{p.equipo_visitante_nombre || `Equipo ${p.equipo_visitante}`}</td>
            <td className="border px-2 py-1">{p.resultado?.find(r => r.equipo === p.equipo_visitante)?.goles_equipo ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
