'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function FormularioBases({
  idTorneo,
  baseAEditar,
  onBaseAgregada,
  onCancelarEdicion
}) {
  const [descripcion, setDescripcion] = useState('');

  // Si se está editando, rellenar el campo
  useEffect(() => {
    if (baseAEditar) {
      setDescripcion(baseAEditar.descripcion_base);
    } else {
      setDescripcion('');
    }
  }, [baseAEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descripcion.trim()) {
      toast.error('⚠️ La descripción de la base es obligatoria.');
      return;
    }

    try {
      const url = baseAEditar
        ? `http://127.0.0.1:8000/api/bases_torneo/${baseAEditar.id}/`
        : 'http://127.0.0.1:8000/api/bases_torneo/';
      const method = baseAEditar ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_torneo: idTorneo,
          descripcion_base: descripcion
        })
      });

      if (response.ok) {
        toast.success(baseAEditar ? ' Base actualizada correctamente.' : ' Base agregada correctamente.');
        setDescripcion('');
        onBaseAgregada && onBaseAgregada();
      } else {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          toast.error(data.error || ' Error al procesar la base.');
        } catch (error) {
          toast.error(' Error inesperado: ' + text);
          console.error('Respuesta inesperada:', text);
        }
      }
    } catch (error) {
      toast.error(' Error en la petición: ' + error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: '1rem',
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '4px'
      }}
    >
      <h4>{baseAEditar ? 'Editar Base' : 'Agregar Base al Torneo'}</h4>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción de la base"
        rows={3}
        style={{ width: '100%', marginBottom: '0.5rem' }}
        required
      ></textarea>
      <div>
        <button type="submit" style={{ marginRight: '0.5rem' }}>
          {baseAEditar ? 'Actualizar' : 'Agregar'}
        </button>
        {baseAEditar && (
          <button type="button" onClick={onCancelarEdicion}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

