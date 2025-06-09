'use client';

import React, { useEffect, useState, useMemo } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function Dashboard() {
  const [torneo, setTorneo] = useState(null);
  const [partidos, setPartidos] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [tablaPosiciones, setTablaPosiciones] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/torneos/')
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setTorneo(data[0]);
      });

    fetch('http://127.0.0.1:8000/api/partidos/')
      .then((res) => res.json())
      .then(setPartidos);

    fetch('http://127.0.0.1:8000/api/resultados/')
      .then((res) => res.json())
      .then(setResultados);

    fetch('http://127.0.0.1:8000/api/tabla-posiciones/')
      .then((res) => res.json())
      .then(setTablaPosiciones);
  }, []);

  const equiposMap = useMemo(() => {
    const map = {};
    partidos.forEach(p => {
      map[p.equipo_local] = p.equipo_local_nombre;
      map[p.equipo_visitante] = p.equipo_visitante_nombre;
    });
    return map;
  }, [partidos]);

  const resultadosRecientes = useMemo(() => {
    if (!partidos.length || !resultados.length) return [];

    const resultadosPorPartido = resultados.reduce((acc, r) => {
      if (!acc[r.partido]) acc[r.partido] = [];
      acc[r.partido].push(r);
      return acc;
    }, {});

    return partidos.filter(p => resultadosPorPartido[p.id_partido]?.length === 2)
      .map(p => {
        const resLocal = resultadosPorPartido[p.id_partido].find(
          r => r.equipo === p.equipo_local
        );
        const resVisitante = resultadosPorPartido[p.id_partido].find(
          r => r.equipo === p.equipo_visitante
        );

        return {
          ...p,
          golesLocal: resLocal?.goles_equipo || 0,
          golesVisitante: resVisitante?.goles_equipo || 0
        };
      });
  }, [partidos, resultados]);

  return (
    <DashboardLayout>
      <div className="p-10 max-w-5xl mx-auto">
        {/* Encabezado del torneo */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {torneo ? torneo.nombre_torneo : "Torneo de Fútbol"}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm" style={{borderRadius:'8px'}}>
            {torneo && (
              <>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  En Curso
                </span>
                <span>| Equipos: {torneo.maximo_equipos} | Fase: {torneo.fase_actual}</span>
              </>
            )}
          </div>
        </div>

        {/* Resumen del Torneo */}
        <section className="mb-10" style={{ borderRadius: '8px' }}>
          <h2 className="text-xl font-bold mb-4">Resumen del Torneo</h2>
          <div className="overflow-x-auto rounded-xl border shadow-sm" style={{ borderRadius: '8px' }}>
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Fecha de Inicio</th>
                  <th className="p-3 text-left">Fecha de Finalización</th>
                  <th className="p-3 text-left">Descripcion</th>
                </tr>
              </thead>
              <tbody>
                {torneo && (
                  <tr>
                    <td className="p-3 font-medium">{formatearFecha(torneo.fecha_inicio)}</td>
                    <td className="p-3 font-medium">{formatearFecha(torneo.fecha_fin)}</td>
                    <td className="p-3 font-medium">{torneo.descripcion_torneo}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Próximos Partidos */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Próximos Partidos</h2>
          <div className="overflow-x-auto rounded-xl border shadow-sm" style={{ borderRadius: '8px' }}>
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Fecha</th>
                  <th className="p-3 text-left">Hora</th>
                  <th className="p-3 text-left">Equipo Local</th>
                  <th className="p-3 text-left">vs</th>
                  <th className="p-3 text-left">Equipo Visitante</th>
                  <th className="p-3 text-left">Cancha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {partidos.map((p) => (
                  <tr key={p.id_partido}>
                    <td className="p-3">{formatearFecha(p.fecha_partido)}</td>
                    <td className="p-3">{p.hora_inicio_ampm}</td>
                    <td className="p-3 font-medium">{p.equipo_local_nombre}</td>
                    <td className="p-3 text-gray-500 text-center">-</td>
                    <td className="p-3 font-medium">{p.equipo_visitante_nombre}</td>
                    <td className="p-3">{p.cancha_nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tabla de Posiciones */}
        {tablaPosiciones.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Tabla de Posiciones (Fase de Grupos)</h2>
            <div className="overflow-x-auto rounded-xl border shadow-sm" style={{ borderRadius: '8px' }}>
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Posición</th>
                    <th className="p-3 text-left">Equipo</th>
                    <th className="p-3 text-left">PJ</th>
                    <th className="p-3 text-left">PG</th>
                    <th className="p-3 text-left">PE</th>
                    <th className="p-3 text-left">PP</th>
                    <th className="p-3 text-left">GF</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {tablaPosiciones
                    .sort((a, b) => b.puntos - a.puntos || b.goles_favor - a.goles_favor)
                    .map((pos, index) => (
                      <tr key={pos.id}>
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3 font-medium">
                          {equiposMap[pos.equipo] || `Equipo ${pos.equipo}`}
                        </td>
                        <td className="p-3">{pos.partidos_jugados}</td>
                        <td className="p-3">{pos.ganados}</td>
                        <td className="p-3">{pos.empatados}</td>
                        <td className="p-3">{pos.perdidos}</td>
                        <td className="p-3">{pos.goles_favor}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {resultadosRecientes.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Resultados Recientes</h2>
            <div className="overflow-x-auto rounded-xl border shadow-sm" style={{ borderRadius: '8px' }}>
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Fecha</th>
                    <th className="p-3 text-left">Hora</th>
                    <th className="p-3 text-left">Equipo Local</th>
                    <th className="p-3 text-left">Resultado</th>
                    <th className="p-3 text-left">Equipo Visitante</th>
                    <th className="p-3 text-left">Cancha</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {resultadosRecientes.map((p) => (
                    <tr key={p.id_partido}>
                      <td className="p-3">{formatearFecha(p.fecha_partido)}</td>
                      <td className="p-3">{p.hora_inicio_ampm}</td>
                      <td className="p-3 font-medium">{p.equipo_local_nombre}</td>
                      <td className="p-3 font-bold">{p.golesLocal} - {p.golesVisitante}</td>
                      <td className="p-3 font-medium">{p.equipo_visitante_nombre}</td>
                      <td className="p-3">{p.cancha_nombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return '';
  const date = new Date(fechaISO);
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}