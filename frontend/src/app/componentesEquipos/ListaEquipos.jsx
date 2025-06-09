'use client';

import { useEffect, useState } from 'react';
import { FaUsers, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import FormEquipo from './FormEquipo';

export default function ListaEquipos({ recargar }) {
  const [equipos, setEquipos] = useState([]);
  const [query, setQuery] = useState('');
  const [equipoIdSeleccionado, setEquipoIdSeleccionado] = useState(null);
  const [equipoAEditar, setEquipoAEditar] = useState(null);
  const [modoFormulario, setModoFormulario] = useState(null);
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

  // ✅ Modificado para que al inscribir, desaparezca el equipo de la lista
  const crearInscripcion = async (equipoId) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/inscripciones/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          equipo: equipoId,
          fecha_solicitud: new Date().toISOString()
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('✅ Inscripción creada correctamente.', { position: 'top-center' });
        setEquipos((prev) => prev.filter((e) => e.id !== equipoId)); 
        setInscripciones(prev => ({
          ...prev,
          [equipoId]: true
        }));
        setEstadosInscripcion(prev => ({
          ...prev,
          [equipoId]: data.estado
        }));
      } else {
        console.error('❌ Error al crear inscripción:', data);
        toast.error(data.error || '❌ Error al crear inscripción.', { position: 'top-center' });
      }
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('❌ Error al crear inscripción.', { position: 'top-center' });
    }
  };

  const eliminarEquipo = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este equipo?')) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/equipos/${id}/`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setEquipos((prev) => prev.filter((e) => e.id !== id));
        setInscripciones(prev => {
          const newInscripciones = { ...prev };
          delete newInscripciones[id];
          return newInscripciones;
        });
        setEstadosInscripcion(prev => {
          const newEstados = { ...prev };
          delete newEstados[id];
          return newEstados;
        });
        toast.success('✅ Equipo eliminado correctamente.');
      } else {
        const data = await response.json();
        toast.error(data.error || '❌ Error al eliminar el equipo.');
      }
    } catch (error) {
      toast.error('❌ Error: ' + error.message);
    }
  };

  const activarEdicionEquipo = (equipo) => {
    setEquipoAEditar(equipo);
    setEquipoIdSeleccionado(equipo.id);
    setModoFormulario('editar');
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
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => activarEdicionEquipo(equipo)} style={{ color: '#0070f3' }}>
                    <FaEdit /> Editar
                  </button>
                  <button onClick={() => eliminarEquipo(equipo.id)} style={{ color: '#dc3545' }}>
                    <FaTrash /> Eliminar
                  </button>
                </div>
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
                  <button
                    onClick={() => crearInscripcion(equipo.id)}
                    style={{
                      background: '#28a745',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    Inscribir Equipo
                  </button>
                )}
              </div>
            </div>

            {equipoIdSeleccionado === equipo.id && (
              <FormEquipo
                equipo={modoFormulario === 'editar' ? equipoAEditar : null}
                onEquipoActualizado={() => {
                  cargarEquipos();
                  cargarInscripciones();
                  setEquipoAEditar(null);
                  setModoFormulario(null);
                  setEquipoIdSeleccionado(null);
                }}
                onCerrar={() => {
                  setEquipoAEditar(null);
                  setModoFormulario(null);
                  setEquipoIdSeleccionado(null);
                }}
              />
            )}
          </li>
        ))}
      </ul>

    </div>
  );
}
