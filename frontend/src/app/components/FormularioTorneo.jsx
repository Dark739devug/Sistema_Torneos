'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

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
    imagen: null,
    fecha_inicio_inscripcion: '',
    fecha_fin_inscripcion: ''
  });

  const fases = ['Fase de grupos', 'Semifinal', 'Final', 'Finalizado'];

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
        imagen: null,
        fecha_inicio_inscripcion: torneo.fecha_inicio_inscripcion || '',
        fecha_fin_inscripcion: torneo.fecha_fin_inscripcion || ''
      });
    }
  }, [torneo]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (name === "maximo_equipos") {
      // Permitir vacío o solo números pares positivos
      if (value === "" || (parseInt(value, 10) % 2 === 0 && parseInt(value, 10) > 0)) {
        setFormData({
          ...formData,
          [name]: value
        });
      } else {
        // Feedback visual
        toast.warning('Por favor, ingrese solo números pares mayores a 0.', {
          position: 'top-center',
          autoClose: 2000
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === 'file' ? files[0] : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formDataToSend.append(key, value);
    });

    try {
      const url = torneo
        ? `http://127.0.0.1:8000/api/torneos/${torneo.id}/`
        : 'http://127.0.0.1:8000/api/torneos/';
      const method = torneo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: { Accept: 'application/json' }
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        data = { error: text };
      }

      console.log('Respuesta del backend:', data);

      if (response.ok) {
        toast.success(data.mensaje || data.message || 'Operación exitosa.', {
          position: 'top-center',
          autoClose: 3000
        });
        onTorneoActualizado && onTorneoActualizado();
      } else {
        toast.error(data.error || data.detail || 'Ocurrió un error inesperado.', {
          position: 'top-center',
          autoClose: 5000
        });
      }
    } catch (error) {
      toast.error('Error en la petición: ' + error.message, {
        position: 'top-center',
        autoClose: 5000
      });
    }
  };

  return (
    <div className="modal-formulario" style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={onCerrar}
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          background: 'transparent',
          border: 'none',
          fontSize: '1.2rem',
          cursor: 'pointer'
        }}
      >
        &times;
      </button>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
      >
        <h2 style={{ textAlign: 'center' }}>{torneo ? 'Editar Torneo' : 'Crear Torneo'}</h2>

        <input type="text" name="nombre_torneo" placeholder="Nombre del torneo" value={formData.nombre_torneo} onChange={handleChange} required />

        <label className="label-estilizado">
          Fecha de inicio Torneo
          <input type="date" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} required />
        </label>

        <label className="label-estilizado">
          Fecha de Fin Torneo
          <input type="date" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} required />
        </label>

        <textarea name="descripcion_torneo" placeholder="Descripción" value={formData.descripcion_torneo} onChange={handleChange} rows={3} required />

        {/* Input de número con validación */}
        <input
          type="number"
          name="maximo_equipos"
          placeholder="Máximo de equipos (números pares)"
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

        <select name="fase_actual" value={formData.fase_actual} onChange={handleChange} required>
          <option value="">Seleccione la fase actual</option>
          {fases.map((fase) => (
            <option key={fase} value={fase}>{fase}</option>
          ))}
        </select>

        <input type="text" name="creado_por" placeholder="Creado por" value={formData.creado_por} onChange={handleChange} required />

        <input type="file" name="imagen" accept="image/*" onChange={handleChange} />

        <label className="label-estilizado">
          Fecha de inicio de inscripción
          <input type="date" name="fecha_inicio_inscripcion" value={formData.fecha_inicio_inscripcion} onChange={handleChange} />
        </label>

        <label className="label-estilizado">
          Fecha de fin de inscripción
          <input type="date" name="fecha_fin_inscripcion" value={formData.fecha_fin_inscripcion} onChange={handleChange} />
        </label>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.4rem 0.75rem' }}>
            {torneo ? 'Actualizar' : 'Crear'}
          </button>
          <button type="button" onClick={onCerrar} style={{ background: '#ccc', border: 'none', borderRadius: '4px', padding: '0.4rem 0.75rem' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
