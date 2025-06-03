'use client';
import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/utils/auth';

export default function FormEquipo({ equipo, onEquipoActualizado, onCerrar }) {
  const [formData, setFormData] = useState({
    nombre_equipo: '',
    color_uniforme: '#000000',
    estado_equipo: 'Pendiente',
    torneo: '',
    grupo: '',
    imagen: null
  });

  const [torneos, setTorneos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDatosIniciales = async () => {
      try {
        const [torneosRes, gruposRes] = await Promise.all([
          fetchWithAuth('/torneos/'),
          fetchWithAuth('/grupos/')
        ]);
        
        if (!torneosRes.ok || !gruposRes.ok) {
          throw new Error('Error al cargar datos iniciales');
        }
        
        setTorneos(await torneosRes.json());
        setGrupos(await gruposRes.json());
        
        if (equipo) {
          setFormData({
            nombre_equipo: equipo.nombre_equipo || '',
            color_uniforme: equipo.color_uniforme || '#000000',
            estado_equipo: equipo.estado_equipo || 'Pendiente',
            torneo: equipo.torneo?.id || '',
            grupo: equipo.grupo?.id || '',
            imagen: null
          });
        }
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchDatosIniciales();
  }, [equipo]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      const url = equipo ? `/equipos/${equipo.id}/` : '/equipos/';
      const method = equipo ? 'PUT' : 'POST';

      const response = await fetchWithAuth(url, {
        method,
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar el equipo');
      }

      onEquipoActualizado();
      onCerrar();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {equipo ? 'Editar Equipo' : 'Nuevo Equipo'}
            </h2>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Equipo*
              </label>
              <input
                type="text"
                name="nombre_equipo"
                value={formData.nombre_equipo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color del Uniforme
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="color_uniforme"
                  value={formData.color_uniforme}
                  onChange={handleChange}
                  className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
                  disabled={loading}
                />
                <span className="text-sm">{formData.color_uniforme}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Torneo*
                </label>
                <select
                  name="torneo"
                  value={formData.torneo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  <option value="">Seleccionar...</option>
                  {torneos.map(torneo => (
                    <option key={torneo.id} value={torneo.id}>
                      {torneo.nombre_torneo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grupo
                </label>
                <select
                  name="grupo"
                  value={formData.grupo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="">Sin grupo</option>
                  {grupos.map(grupo => (
                    <option key={grupo.id} value={grupo.id}>
                      {grupo.nombre_grupo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado*
              </label>
              <select
                name="estado_equipo"
                value={formData.estado_equipo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                disabled={loading}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo del Equipo
              </label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-white py-1 px-3 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  Seleccionar archivo
                  <input
                    type="file"
                    name="imagen"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
                <span className="text-sm text-gray-500">
                  {formData.imagen?.name || 'Ningún archivo seleccionado'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onCerrar}
                className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
              >
                {loading ? 'Guardando...' : equipo ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}