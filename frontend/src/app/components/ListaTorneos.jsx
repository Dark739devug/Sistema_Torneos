'use client';

import { useEffect, useState } from 'react';
import { FaTrophy, FaUsers, FaCalendarAlt, FaEdit, FaTrash, FaSearch, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

import FormularioBases from './FormularioBases';

export default function ListaTorneos({ recargar, onEditar }) {
  const [torneos, setTorneos] = useState([]);
  const [query, setQuery] = useState('');
  const [torneoIdSeleccionado, setTorneoIdSeleccionado] = useState(null);
  const [baseAEditar, setBaseAEditar] = useState(null);

  const cargarTorneos = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/torneos/?search=${query}`);
      if (response.ok) {
        const data = await response.json();
        setTorneos(data);
      } else {
        toast.error('❌ Error al obtener la lista de torneos.');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('❌ Error: ' + error.message);
    }
  };

  const eliminarTorneo = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este torneo?')) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/torneos/${id}/`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setTorneos((prev) => prev.filter((t) => t.id !== id));
        toast.success('✅ Torneo eliminado correctamente.');
      } else {
        const data = await response.json();
        toast.error(data.error || '❌ Error al eliminar el torneo.');
      }
    } catch (error) {
      toast.error('❌ Error: ' + error.message);
    }
  };

  const toggleFormularioBases = (idTorneo) => {
    if (torneoIdSeleccionado === idTorneo) {
      setTorneoIdSeleccionado(null);
      setBaseAEditar(null);
    } else {
      setTorneoIdSeleccionado(idTorneo);
      setBaseAEditar(null);
    }
  };

  const activarEdicionBase = (base, idTorneo) => {
    setBaseAEditar(base);
    setTorneoIdSeleccionado(idTorneo);
  };

  useEffect(() => {
    cargarTorneos();
  }, [recargar, query]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1><FaTrophy style={{ marginRight: '0.5rem' }} /> Lista de Torneos</h1>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <FaSearch style={{ marginRight: '0.5rem' }} />
        <input
          type="text"
          placeholder="Buscar torneo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '0.5rem', flex: 1, maxWidth: '400px' }}
        />
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {torneos.map((torneo) => (
          <li key={torneo.id} style={{
            marginBottom: '1rem',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {torneo.imagen && (
                <div style={{ flex: '0 0 150px' }}>
                  <img src={torneo.imagen} alt="Logo" style={{ width: '150px', borderRadius: '4px' }} />
                </div>
              )}

              <div style={{ flex: 1 }}>
                <h3><FaTrophy style={{ marginRight: '0.5rem' }} /> {torneo.nombre_torneo}</h3>
                <p><strong><FaCalendarAlt /> Fecha inicio:</strong> {torneo.fecha_inicio}</p>
                <p><strong><FaCalendarAlt /> Fecha fin:</strong> {torneo.fecha_fin}</p>
                {torneo.fecha_inicio_inscripcion && (
                  <p><strong>Inicio inscripción:</strong> {torneo.fecha_inicio_inscripcion}</p>
                )}
                {torneo.fecha_fin_inscripcion && (
                  <p><strong>Fin inscripción:</strong> {torneo.fecha_fin_inscripcion}</p>
                )}
                <p><strong>Descripción:</strong> {torneo.descripcion_torneo}</p>
                <p><strong>Fase actual:</strong> {torneo.fase_actual}</p>
                <p><strong><FaUsers /> Máximo equipos:</strong> {torneo.maximo_equipos}</p>
                <p><strong>Número de grupos:</strong> {torneo.numero_grupos}</p>
                <p><strong>Creado por:</strong> {torneo.creado_por}</p>

                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => onEditar(torneo)} style={{ color: '#0070f3' }}>
                    <FaEdit /> Editar
                  </button>
                  <button onClick={() => eliminarTorneo(torneo.id)} style={{ color: '#dc3545' }}>
                    <FaTrash /> Eliminar
                  </button>
                  <button onClick={() => toggleFormularioBases(torneo.id)} style={{ color: '#28a745' }}>
                    <FaPlus /> Agregar Base
                  </button>
                </div>
              </div>

              {torneo.bases && torneo.bases.length > 0 && (
                <div style={{
                  width: '450px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  minWidth: '200px',
                  color: '#071810',
                  borderLeft: '3px solid #1C322D'
                }}>
                  <h4 style={{ margin: 0 }}>Bases:</h4>
                  <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                    {torneo.bases.map((base) => (
                      <li key={base.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>🔹 {base.descripcion_base}</span>
                        <button
                          onClick={() => activarEdicionBase(base, torneo.id)}
                          style={{
                            background: 'transparent',
                            display: 'flex',
                            border: 'none',
                            color: '#071810',
                            cursor: 'pointer',
                            fontSize: '1rem'
                          }}
                        >
                          <FaEdit />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {torneoIdSeleccionado === torneo.id && (
              <FormularioBases
                idTorneo={torneo.id}
                baseAEditar={baseAEditar}
                onBaseAgregada={() => {
                  cargarTorneos(); 
                  setBaseAEditar(null);
                }}
                onCancelarEdicion={() => setBaseAEditar(null)}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
