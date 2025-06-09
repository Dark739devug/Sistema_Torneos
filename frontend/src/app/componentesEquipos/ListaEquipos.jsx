'use client';
import { useEffect, useState } from 'react';
import { FaUsers, FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { fetchWithAuth } from '@/utils/auth';
import FormEquipo from './FormEquipo';

export default function ListaEquipos() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [equipoEditando, setEquipoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [torneoSeleccionado, setTorneoSeleccionado] = useState('');
  const [torneos, setTorneos] = useState([]);

  const cargarEquipos = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth('/equipos/');
      if (!response.ok) {
        throw new Error('Error al cargar equipos');
      }
      setEquipos(await response.json());
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarTorneos = async () => {
    try {
      const response = await fetchWithAuth('/api/torneos/');
      if (!response.ok) {
        throw new Error('Error al cargar torneos');
      }
      setTorneos(await response.json());
    } catch (err) {
      console.error('Error al cargar torneos:', err);
    }
  };

  const eliminarEquipo = async (id) => {
    if (!confirm('¿Está seguro de eliminar este equipo?')) return;
    
    try {
      const response = await fetchWithAuth(`/api/equipos/${id}/`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar equipo');
      }
      
      setEquipos(equipos.filter(e => e.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditar = (equipo) => {
    setEquipoEditando(equipo);
    setModalAbierto(true);
  };

  const handleNuevoEquipo = () => {
    setEquipoEditando(null);
    setModalAbierto(true);
  };

  const filtrarEquipos = () => {
    return equipos.filter(equipo => {
      const coincideNombre = equipo.nombre_equipo.toLowerCase().includes(busqueda.toLowerCase());
      const coincideTorneo = !torneoSeleccionado || equipo.torneo?.id === parseInt(torneoSeleccionado);
      return coincideNombre && coincideTorneo;
    });
  };

  useEffect(() => {
    cargarEquipos();
    cargarTorneos();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaUsers className="mr-2" /> Listado de Equipos
        </h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar equipo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={torneoSeleccionado}
          onChange={(e) => setTorneoSeleccionado(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los torneos</option>
          {torneos.map(torneo => (
            <option key={torneo.id} value={torneo.id}>{torneo.nombre_torneo}</option>
          ))}
        </select>
        
        <button
          onClick={handleNuevoEquipo}
          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaPlus className="mr-2" /> Nuevo Equipo
        </button>
      </div>

      {modalAbierto && (
        <FormEquipo
          equipo={equipoEditando}
          onEquipoActualizado={cargarEquipos}
          onCerrar={() => setModalAbierto(false)}
        />
      )}

      {filtrarEquipos().length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {busqueda || torneoSeleccionado ? 'No se encontraron equipos con esos criterios' : 'No hay equipos registrados'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Torneo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtrarEquipos().map(equipo => (
                <tr key={equipo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {equipo.imagen && (
                        <img 
                          src={equipo.imagen} 
                          alt={equipo.nombre_equipo}
                          className="h-10 w-10 rounded-full mr-3 object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{equipo.nombre_equipo}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span 
                            className="inline-block h-3 w-3 rounded-full mr-1 border border-gray-300"
                            style={{ backgroundColor: equipo.color_uniforme }}
                          ></span>
                          {equipo.color_uniforme}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {equipo.torneo?.nombre_torneo || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {equipo.grupo?.nombre_grupo || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${equipo.estado_equipo === 'Aprobado' ? 'bg-green-100 text-green-800' : 
                        equipo.estado_equipo === 'Rechazado' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {equipo.estado_equipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditar(equipo)}
                      className="text-blue-600 hover:text-blue-900 mr-4 flex items-center"
                      title="Editar equipo"
                    >
                      <FaEdit className="mr-1" /> Editar
                    </button>
                    <button
                      onClick={() => eliminarEquipo(equipo.id)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                      title="Eliminar equipo"
                    >
                      <FaTrash className="mr-1" /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}