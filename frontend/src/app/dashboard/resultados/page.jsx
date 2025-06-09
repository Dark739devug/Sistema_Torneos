'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import FormularioResultados from '@/app/componentesResultados/resultadosform';

function VerResultados({ torneoId }) {
  const [partidos, setPartidos] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/partidos/?torneo=${torneoId}`)
      .then((res) => res.json())
      .then((data) => setPartidos(data))
      .catch((err) => console.error('Error al cargar los partidos:', err));
  }, [torneoId]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">📊 Resultados de Partidos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Fecha</th>
              <th className="px-4 py-2 border">Equipo Local</th>
              <th className="px-4 py-2 border">Goles</th>
              <th className="px-4 py-2 border">Equipo Visitante</th>
              <th className="px-4 py-2 border">Goles</th>
            </tr>
          </thead>
          <tbody>
            {partidos
              .filter(p => p.resultado && p.resultado.length >= 2)
              .map((p, index) => (
                <tr key={index} className="text-center hover:bg-gray-100">
                  <td className="border px-4 py-2">{p.fecha_partido}</td>
                  <td className="border px-4 py-2">{p.equipo_local_nombre || `Equipo ${p.equipo_local}`}</td>
                  <td className="border px-4 py-2 font-semibold text-blue-700">
                    {p.resultado.find(r => r.equipo === p.equipo_local)?.goles_equipo ?? '-'}
                  </td>
                  <td className="border px-4 py-2">{p.equipo_visitante_nombre || `Equipo ${p.equipo_visitante}`}</td>
                  <td className="border px-4 py-2 font-semibold text-red-700">
                    {p.resultado.find(r => r.equipo === p.equipo_visitante)?.goles_equipo ?? '-'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ResultadosPage() {
  const torneoId = 1;

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">🏟️ Registrar Resultado</h1>
          <FormularioResultados />
        </div>
        <VerResultados torneoId={torneoId} />
      </div>
    </DashboardLayout>
  );
}
