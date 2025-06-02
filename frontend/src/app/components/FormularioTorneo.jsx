'use client';

import { useState, useEffect } from 'react';

export default function FormularioTorneo({ torneo, onTorneoActualizado, onCerrar }) {
  const [formData, setFormData] = useState({
    nombre_torneo: '',
    fecha_inicio: '',
    fecha_fin: '',
    descripcion_torneo: '',
    maximo_equipos: '',
    numero_grupos: '',
    fase_actual: '',
    creado_por: '',
    imagen: null
  });

  const fases = ['Fase de grupos', 'Semifinal', 'Final', 'Finalizado'];

  // Si es edición, carga los datos iniciales
  useEffect(() => {
    if (torneo) {
      setFormData({
        nombre_torneo: torneo.nombre_torneo,
        fecha_inicio: torneo.fecha_inicio,
        fecha_fin: torneo.fecha_fin,
        descripcion_torneo: torneo.descripcion_torneo,
        maximo_equipos: torneo.maximo_equipos,
        numero_grupos: torneo.numero_grupos,
        fase_actual: torneo.fase_actual,
        creado_por: torneo.creado_por,
        imagen: null
      });
    }
  }, [torneo]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('nombre_torneo', formData.nombre_torneo);
    formDataToSend.append('fecha_inicio', formData.fecha_inicio);
    formDataToSend.append('fecha_fin', formData.fecha_fin);
    formDataToSend.append('descripcion_torneo', formData.descripcion_torneo);
    formDataToSend.append('maximo_equipos', formData.maximo_equipos);
    formDataToSend.append('numero_grupos', formData.numero_grupos);
    formDataToSend.append('fase_actual', formData.fase_actual);
    formDataToSend.append('creado_por', formData.creado_por);
    if (formData.imagen) {
      formDataToSend.append('imagen', formData.imagen);
    }

    try {
      const url = torneo
        ? `http://127.0.0.1:8000/api/torneos/${torneo.id}/`
        : 'http://127.0.0.1:8000/api/torneos/';
      const method = torneo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (response.ok) {
        onTorneoActualizado && onTorneoActualizado();
      } else {
        const data = await response.json();
        alert('❌ Error: ' + JSON.stringify(data));
      }
    } catch (error) {
      alert('❌ Error en la petición: ' + error.message);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Botón flotante para cerrar (❌) */}
      <button
        type="button"
        onClick={onCerrar}
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          background: 'transparent',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer'
        }}
      >
        &times;
      </button>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <h2>{torneo ? 'Editar Torneo' : 'Crear Torneo'}</h2>

        <input
          type="text"
          name="nombre_torneo"
          placeholder="Nombre del torneo"
          value={formData.nombre_torneo}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="fecha_inicio"
          value={formData.fecha_inicio}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="fecha_fin"
          value={formData.fecha_fin}
          onChange={handleChange}
          required
        />
        <textarea
          name="descripcion_torneo"
          placeholder="Descripción"
          value={formData.descripcion_torneo}
          onChange={handleChange}
          rows={3}
          required
        />
        <input
          type="number"
          name="maximo_equipos"
          placeholder="Máximo de equipos"
          value={formData.maximo_equipos}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="numero_grupos"
          placeholder="Número de grupos"
          value={formData.numero_grupos}
          onChange={handleChange}
          required
        />
        <select
          name="fase_actual"
          value={formData.fase_actual}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione la fase actual</option>
          {fases.map((fase) => (
            <option key={fase} value={fase}>{fase}</option>
          ))}
        </select>
        <input
          type="text"
          name="creado_por"
          placeholder="Nombre del usuario que crea el torneo"
          value={formData.creado_por}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="imagen"
          accept="image/*"
          onChange={handleChange}
        />

        <div>
          <button type="submit">{torneo ? 'Actualizar' : 'Crear'}</button>
          <button type="button" onClick={onCerrar}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
