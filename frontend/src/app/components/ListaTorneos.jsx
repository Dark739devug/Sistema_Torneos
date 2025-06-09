'use client';

import { useEffect, useState } from 'react';
import { FaTrophy, FaUsers, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { fetchWithAuth } from '@/utils/auth';

export default function ListaTorneos({ recargar, onEditar }) {
  const [torneos, setTorneos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const cargarTorneos = async () => {
    try {
      const response = await fetchWithAuth('/api/torneos/');
      const data = await response.json();
      setTorneos(data);
    } catch (error) {
      console.error('❌ Error:', error);
      setMensaje('❌ Error: ' + error.message);
    }
  };

  const eliminarTorneo = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este torneo?')) return;
    try {
      const response = await fetchWithAuth(`/api/torneos/${id}/`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setTorneos((prev) => prev.filter((t) => t.id !== id));
        setMensaje('✅ Torneo eliminado');
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setMensaje('❌ Error al eliminar el torneo');
      }
    } catch (error) {
      setMensaje('❌ Error: ' + error.message);
    }
  };

  useEffect(() => {
    cargarTorneos();
  }, [recargar]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1><FaTrophy style={{ marginRight: '0.5rem' }} /> Lista de Torneos</h1>

      {mensaje && (
        <div style={{ margin: '1rem 0', background: '#f8d7da', padding: '0.5rem', borderRadius: '4px' }}>
          {mensaje}
        </div>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {torneos.map((torneo) => (
          <li key={torneo.id} style={{
            marginBottom: '1rem',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            display: 'flex',
            gap: '1rem'
          }}>
            {torneo.imagen && (
              <img src={torneo.imagen} alt="Logo" style={{ width: '150px', borderRadius: '4px' }} />
            )}
            <div style={{ flex: 1 }}>
              <h3><FaTrophy style={{ marginRight: '0.5rem' }} /> {torneo.nombre_torneo}</h3>
              <p><strong><FaCalendarAlt /> Fecha inicio:</strong> {torneo.fecha_inicio}</p>
              <p><strong><FaCalendarAlt /> Fecha fin:</strong> {torneo.fecha_fin}</p>
              <p><strong>Descripción:</strong> {torneo.descripcion_torneo}</p>
              <p><strong>Fase actual:</strong> {torneo.fase_actual}</p>
              <p><strong><FaUsers /> Máximo equipos:</strong> {torneo.maximo_equipos}</p>
              <p><strong>Número de grupos:</strong> {torneo.numero_grupos}</p>
              <p><strong>Creado por:</strong> {torneo.creado_por}</p>
              <div style={{ marginTop: '0.5rem' }}>
                <button onClick={() => onEditar(torneo)} style={{ marginRight: '0.5rem', color: '#0070f3' }}>
                  <FaEdit /> Editar
                </button>
                <button onClick={() => eliminarTorneo(torneo.id)} style={{ color: '#dc3545' }}>
                  <FaTrash /> Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

