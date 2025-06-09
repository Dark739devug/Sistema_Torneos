'use client';
import { useEffect, useState } from 'react';
import ResultadosPorJornada from '@/app/componenteJornadas/ResultadosPorJornada';
import TablaPosicionesPorGrupo from '@/app/componentesResultados/TablaPosicionesPorGrupo';
import TopGoleadoresPorGrupo from '@/app/componentesResultados/TopGoleadoresPorGrupo';
import TablaPosiciones from '@/app/componentesResultados/tablaposicion';
import TopGoleadores from '@/app/componentesResultados/TopGoleadores';
import { FaTrophy, FaFutbol, FaTable, FaUsers, FaCalendarAlt, FaChartBar, FaMedal, FaStar } from 'react-icons/fa';

export default function VistaEstadisticasPublica({ torneoId }) {
  const [jornadas, setJornadas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [jornadasRes, gruposRes] = await Promise.all([
          fetch(`http://localhost:8000/api/jornadas/?torneo=${torneoId}`),
          fetch(`http://localhost:8000/api/grupos/?torneo=${torneoId}`)
        ]);

        if (!jornadasRes.ok || !gruposRes.ok) {
          throw new Error('Error al cargar datos');
        }

        const jornadasData = await jornadasRes.json();
        const gruposData = await gruposRes.json();

        setJornadas(jornadasData);
        setGrupos(gruposData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [torneoId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p>Error al cargar las estadísticas: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 max-w-7xl mx-auto">
      {/* Sección de Resultados por Jornada */}
      <section className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-blue-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-800">
              <span className="text-blue-600">Resultados</span> por Jornada
            </h2>
          </div>
          <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            <FaFutbol className="mr-1" />
            {jornadas.length} Jornadas
          </div>
        </div>
        
        {jornadas.length > 0 ? (
          <div className="space-y-8">
            {jornadas.map((j) => (
              <div key={j.id} className="border border-gray-100 rounded-lg p-5 bg-gray-50 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    {j.numero_jornada}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700">
                    {j.nombre_jornada || `Jornada ${j.numero_jornada}`}
                  </h3>
                </div>
                <ResultadosPorJornada jornadaId={j.id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500">No hay jornadas registradas aún</p>
          </div>
        )}
      </section>

      {/* Sección de Estadísticas por Grupo */}
      {grupos.length > 0 && (
        <section className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FaUsers className="text-blue-600 text-2xl" />
            <h2 className="text-2xl font-bold text-gray-800">
              <span className="text-blue-600">Estadísticas</span> por Grupo
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {grupos.map((g) => (
              <div key={g.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FaTable className="text-blue-500" />
                    <h3 className="text-xl font-semibold text-gray-700">
                      <span className="text-blue-600">Grupo</span> {g.nombre_grupo}
                    </h3>
                  </div>
                  <span className="flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                    <FaUsers className="mr-1 text-xs" />
                    {g.equipos_count || 0} equipos
                  </span>
                </div>
                
                <div className="space-y-6">
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <div className="flex items-center bg-gray-100 px-4 py-2">
                      <FaMedal className="text-yellow-500 mr-2" />
                      <h4 className="text-sm font-medium text-gray-700">Tabla de Posiciones</h4>
                    </div>
                    <TablaPosicionesPorGrupo grupoId={g.id} />
                  </div>
                  
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <div className="flex items-center bg-gray-100 px-4 py-2">
                      <FaStar className="text-yellow-500 mr-2" />
                      <h4 className="text-sm font-medium text-gray-700">Máximos Goleadores</h4>
                    </div>
                    <TopGoleadoresPorGrupo grupoId={g.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sección de Resumen General */}
      <section className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <FaChartBar className="text-blue-600 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-800">
            <span className="text-blue-600">Resumen</span> General del Torneo
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FaTrophy className="text-yellow-500" />
                <h3 className="text-xl font-semibold text-gray-700">Tabla de Posiciones</h3>
              </div>
              <span className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                <FaMedal className="mr-1" />
                Clasificación
              </span>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
              <TablaPosiciones torneoId={torneoId} />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FaFutbol className="text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-700">Máximos Goleadores</h3>
              </div>
              <span className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                <FaStar className="mr-1" />
                Goleo
              </span>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
              <TopGoleadores torneoId={torneoId} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}