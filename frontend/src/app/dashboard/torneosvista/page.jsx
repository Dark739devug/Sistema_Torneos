'use client';

import { useEffect, useState } from 'react';
import { FaTrophy, FaUsers, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function ListaTorneos({ recargar }) {
  const [torneos, setTorneos] = useState([]);
  const [query, setQuery] = useState('');

  const cargarTorneos = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/torneos/?search=${query}`);
      if (response.ok) {
        const data = await response.json();
        setTorneos(data);
      } else {
        toast.error(' Error al obtener la lista de torneos.');
      }
    } catch (error) {
      console.error(' Error:', error);
      toast.error(' Error: ' + error.message);
    }
  };

  useEffect(() => {
    cargarTorneos();
  }, [recargar, query]);

  return (
    <DashboardLayout>
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
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {torneo.imagen && (
                  <div style={{ flex: '0 0 200px' }}>
                    <img
                      src={torneo.imagen}
                      alt="Logo"
                      style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
                    />
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
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
}
