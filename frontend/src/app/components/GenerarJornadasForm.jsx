'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

export default function GenerarJornadasForm({ onClose, idTorneo, nombreTorneo, onGenerado }) {
  const [numJornadas, setNumJornadas] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [intervaloDias, setIntervaloDias] = useState(7);

  const handleGenerar = async () => {
    if (!numJornadas || !fechaInicio) {
      toast.error("Completa todos los campos");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/generar-jornadas/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_torneo: idTorneo,
          num_jornadas: parseInt(numJornadas),
          fecha_inicio: fechaInicio,
          intervalo_dias: parseInt(intervaloDias)
        })
      });

      if (response.ok) {
        toast.success("✅ Jornadas generadas correctamente");
        onGenerado();
        onClose();
      } else {
        const error = await response.json();
        toast.error(error.error || "Error al generar las jornadas");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión");
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '1rem', marginTop: '1rem' }}>
      <h3>Generar Jornadas para: {nombreTorneo}</h3>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Cantidad de Jornadas:</label>
        <input
          type="number"
          value={numJornadas}
          onChange={(e) => setNumJornadas(e.target.value)}
          style={{ width: '100%', padding: '0.3rem' }}
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Fecha de Inicio:</label>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          style={{ width: '100%', padding: '0.3rem' }}
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Intervalo de días (opcional):</label>
        <input
          type="number"
          value={intervaloDias}
          onChange={(e) => setIntervaloDias(e.target.value)}
          style={{ width: '100%', padding: '0.3rem' }}
        />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={handleGenerar}
          style={{ background: '#6f42c1', color: '#fff', border: 'none', padding: '0.3rem 0.7rem', cursor: 'pointer', borderRadius: '4px' }}
        >
          Generar Jornadas
        </button>
        <button
          onClick={onClose}
          style={{ background: '#ccc', border: 'none', padding: '0.3rem 0.7rem', cursor: 'pointer', borderRadius: '4px' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
