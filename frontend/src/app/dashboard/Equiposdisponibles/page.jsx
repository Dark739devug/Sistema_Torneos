'use client';

import { useEffect, useState } from 'react';
import { FaUsers, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function ListaEquipos({ recargar }) {
  const [equipos, setEquipos] = useState([]);
  const [query, setQuery] = useState('');
  const [inscripciones, setInscripciones] = useState({});
  const [estadosInscripcion, setEstadosInscripcion] = useState({});

  const cargarEquipos = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/equipos/?search=${query}`);
      if (response.ok) {
        const data = await response.json();
        setEquipos(data);
      } else {
        toast.error('❌ Error al obtener la lista de equipos.');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('❌ Error: ' + error.message);
    }
  };

  const cargarInscripciones = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/inscripciones/');
      if (response.ok) {
        const data = await response.json();
        const inscripcionesMap = {};
        const estadosMap = {};
        data.forEach(inscripcion => {
          inscripcionesMap[inscripcion.equipo] = true;
          estadosMap[inscripcion.equipo] = inscripcion.estado;
        });
        setInscripciones(inscripcionesMap);
        setEstadosInscripcion(estadosMap);
      } else {
        toast.error('❌ Error al obtener las inscripciones.');
      }
    } catch (error) {
      console.error('❌ Error al cargar inscripciones:', error);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Aprobada':
        return 'green';
      case 'Pendiente':
        return 'orange';
      case 'Rechazada':
        return 'red';
      default:
        return 'black';
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      await cargarEquipos();
      await cargarInscripciones();
    };
    cargarDatos();
  }, [recargar, query]);

  return (
    <DashboardLayout>
      <div style={{ padding: '2rem' }}>
        <h1><FaUsers style={{ marginRight: '0.5rem' }} /> Lista de Equipos</h1>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <FaSearch style={{ marginRight: '0.5rem' }} />
          <input
            type="text"
            placeholder="Buscar equipo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: '0.5rem', flex: 1, maxWidth: '400px' }}
          />
        </div>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {equipos.map((equipo) => (
            <li
              key={equipo.id}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '0 0 200px' }}>
                  {equipo.imagen ? (
                    <img
                      src={equipo.imagen}
                      alt={equipo.nombre_equipo}
                      style={{
                        width: '200px',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '200px',
                        height: '200px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      Sin imagen
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h3>
                    <FaUsers style={{ marginRight: '0.5rem' }} />
                    {equipo.nombre_equipo}
                  </h3>
                  <p><strong>Color uniforme:</strong> {equipo.color_uniforme}</p>
                  <p><strong>Estado:</strong> {equipo.estado_equipo}</p>
                  <p><strong>Creado por:</strong> {equipo.creado_por}</p>
                  <p><strong>Torneo:</strong> {equipo.torneo_detalle ? equipo.torneo_detalle.nombre_torneo : 'N/A'}</p>
                  {equipo.fecha_creacion && (
                    <p><strong>Fecha creación:</strong> {equipo.fecha_creacion}</p>
                  )}
                  {equipo.fecha_modificacion && (
                    <p><strong>Fecha modificación:</strong> {equipo.fecha_modificacion}</p>
                  )}
                </div>

                <div style={{
                  flex: '0 0 200px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <p><strong>Grupo asignado:</strong> {equipo.grupo ? equipo.grupo.nombre_grupo : 'No asignado'}</p>
                  {inscripciones[equipo.id] ? (
                    <div>
                      <p style={{ color: 'green', fontWeight: 'bold' }}>✅ Inscripción enviada</p>
                      <p>
                        Estado: 
                        <span style={{ 
                          color: getEstadoColor(estadosInscripcion[equipo.id]),
                          fontWeight: 'bold',
                          marginLeft: '0.5rem'
                        }}>
                          {estadosInscripcion[equipo.id]}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <p style={{ fontStyle: 'italic', color: '#999' }}>No inscrito</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
}
