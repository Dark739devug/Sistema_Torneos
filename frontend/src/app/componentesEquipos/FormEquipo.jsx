'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function FormularioEquipo({ equipo, onEquipoActualizado, onCerrar }) {
  const [formData, setFormData] = useState({
    nombre_equipo: '',
    color_uniforme: '',
    creado_por: '',
    torneo: '',
    imagen: null
  });

  const [torneos, setTorneos] = useState([]);

  useEffect(() => {
    const obtenerTorneos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/torneos/');
        if (response.ok) {
          const data = await response.json();
          const torneosFiltrados = data.map((torneo) => ({
            id: torneo.id,
            nombre: torneo.nombre_torneo
          }));
          setTorneos(torneosFiltrados);
        } else {
          console.error('❌ Error al obtener torneos');
        }
      } catch (error) {
        console.error('❌ Error al obtener torneos:', error);
      }
    };

    obtenerTorneos();
  }, []);

  useEffect(() => {
    if (equipo) {
      setFormData({
        nombre_equipo: equipo.nombre_equipo || '',
        color_uniforme: equipo.color_uniforme || '',
        creado_por: equipo.creado_por || '',
        torneo: equipo.torneo ? equipo.torneo.id : '',
        imagen: null
      });
    }
  }, [equipo]);

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
    Object.entries({
      ...formData,
      estado_equipo: 'Activo'  // ✅ Siempre enviamos "Activo"
    }).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        formDataToSend.append(key, value);
      }
    });

    try {
      const url = equipo
        ? `http://127.0.0.1:8000/api/equipos/${equipo.id}/`
        : 'http://127.0.0.1:8000/api/equipos/';
      const method = equipo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend
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
        toast.success(data.mensaje || data.message || ' Operación exitosa.', {
          position: 'top-center',
          autoClose: 3000
        });
        onEquipoActualizado && onEquipoActualizado();
      } else {
        const errores = Object.entries(data)
          .map(([campo, mensajes]) => {
            if (Array.isArray(mensajes)) {
              return `${campo}: ${mensajes.join(', ')}`;
            }
            return `${campo}: ${mensajes}`;
          })
          .join('\n');

        toast.error(errores || ' Ocurrió un error inesperado.', {
          position: 'top-center',
          autoClose: 5000
        });
      }
    } catch (error) {
      toast.error(' Error en la petición: ' + error.message, {
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
        encType="multipart/form-data"
      >
        <h2 style={{ textAlign: 'center' }}>{equipo ? 'Editar Equipo' : 'Crear Equipo'}</h2>

        <input
          type="text"
          name="nombre_equipo"
          placeholder="Nombre del equipo"
          value={formData.nombre_equipo}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="color_uniforme"
          placeholder="Color del uniforme"
          value={formData.color_uniforme}
          onChange={handleChange}
          required
        />

        {/* estado_equipo ya no aparece en el formulario */}


        <input
          type="text"
          name="creado_por"
          placeholder="Creado por"
          value={formData.creado_por}
          onChange={handleChange}
          required
        />

        <select
          name="torneo"
          value={formData.torneo}
          onChange={handleChange}
          required={!equipo}
        >
          <option value="">Seleccione torneo</option>
          {torneos.map((torneo) => (
            <option key={torneo.id} value={torneo.id}>
              {torneo.nombre}
            </option>
          ))}
        </select>

        <label className="label-estilizado">
          Imagen del equipo
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleChange}
          />
        </label>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            type="submit"
            style={{
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '0.4rem 0.75rem'
            }}
          >
            {equipo ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={onCerrar}
            style={{
              background: '#ccc',
              border: 'none',
              borderRadius: '4px',
              padding: '0.4rem 0.75rem'
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

