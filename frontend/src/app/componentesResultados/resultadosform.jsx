'use client';
import { useEffect, useState } from 'react';
import { Combobox } from '@headlessui/react';

function AutocompleteParticipante({ value, onChange, participantes }) {
  const [query, setQuery] = useState('');

  const filtered =
    query === ''
      ? participantes
      : participantes.filter((p) =>
          `${p.carnet} ${p.nombre_estudiante} ${p.apellido_estudiante}`
            .toLowerCase()
            .includes(query.toLowerCase())
        );

  const selectedParticipante = participantes.find((p) => p.id === value) || null;

  return (
    <Combobox value={selectedParticipante} onChange={p => onChange(p ? p.id : '')}>
      <div className="relative w-full">
        <Combobox.Input
          className="border border-gray-300 rounded px-3 py-2 w-full"
          onChange={(e) => setQuery(e.target.value)}
          displayValue={(p) =>
            p
              ? `${p.carnet} - ${p.nombre_estudiante} ${p.apellido_estudiante}`
              : ''
          }
        />
        <Combobox.Options className="absolute z-10 bg-white border mt-1 max-h-60 overflow-auto w-full rounded shadow-md">
          {filtered.map((p) => (
            <Combobox.Option
              key={p.id}
              value={p}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {p.carnet} - {p.nombre_estudiante} {p.apellido_estudiante}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}

export default function ResultadoForm() {
  const [formData, setFormData] = useState({
    partido_id: '',
    resultados: [
      { equipo_id: '', goles: '', amarillas: '', rojas: '', puntos: '', tipo_resultado: '' },
      { equipo_id: '', goles: '', amarillas: '', rojas: '', puntos: '', tipo_resultado: '' }
    ],
    goleadores: [
      { participante_id: '', goles: '' }
    ],
    tarjetas: [
      { participante_id: '', tipo: '' }
    ]
  });

  const [participantes, setParticipantes] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    // Cargar datos iniciales
    const fetchData = async () => {
      try {
        const [participantesRes, partidosRes, equiposRes] = await Promise.all([
          fetch('http://localhost:8000/api/participantes/'),
          fetch('http://localhost:8000/api/partidos/'),
          fetch('http://localhost:8000/api/equipos/')
        ]);
        
        const participantesData = await participantesRes.json();
        const partidosData = await partidosRes.json();
        const equiposData = await equiposRes.json();
        
        setParticipantes(participantesData);
        setPartidos(partidosData);
        setEquipos(equiposData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleChangeResultado = (index, field, value) => {
    const newResultados = [...formData.resultados];
    newResultados[index][field] = value;
    setFormData({ ...formData, resultados: newResultados });
  };

  const addGoleador = () => {
    setFormData({
      ...formData,
      goleadores: [...formData.goleadores, { participante_id: '', goles: '' }]
    });
  };

  const handleGoleadorChange = (index, field, value) => {
    const newGoleadores = [...formData.goleadores];
    newGoleadores[index][field] = value;
    setFormData({ ...formData, goleadores: newGoleadores });
  };

  const addTarjeta = () => {
    setFormData({
      ...formData,
      tarjetas: [...formData.tarjetas, { participante_id: '', tipo: '' }]
    });
  };

  const handleTarjetaChange = (index, field, value) => {
    const newTarjetas = [...formData.tarjetas];
    newTarjetas[index][field] = value;
    setFormData({ ...formData, tarjetas: newTarjetas });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/resultados/registrar_resultado_completo/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      alert(data.mensaje || 'Resultado registrado.');
    } catch (error) {
      alert('Error al registrar el resultado.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white rounded shadow-md max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold">Registrar Resultado de Partido</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Seleccionar Partido:</label>
        <select
          className="border p-2 rounded w-full"
          value={formData.partido_id}
          onChange={(e) => setFormData({ ...formData, partido_id: e.target.value })}
          required
        >
          <option value="">-- Selecciona un partido --</option>
          {partidos.map((p) => (
            <option key={p.id} value={p.id}>
              {new Date(p.fecha_partido).toLocaleDateString()} — {p.equipo_local_nombre || `Equipo ${p.equipo_local}`} vs. {p.equipo_visitante_nombre || `Equipo ${p.equipo_visitante}`}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formData.resultados.map((res, index) => (
          <div key={index} className="border p-4 bg-gray-50 rounded">
            <h4 className="font-bold text-lg mb-3">Equipo {index + 1}</h4>
            
            <div className="mb-3">
              <label className="block font-semibold mb-1">Equipo:</label>
              <select
                className="border p-2 rounded w-full"
                value={res.equipo_id}
                onChange={(e) => handleChangeResultado(index, 'equipo_id', e.target.value)}
                required
              >
                <option value="">-- Selecciona un equipo --</option>
                {equipos.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-3">
              <label className="block font-semibold mb-1">Goles:</label>
              <input 
                type="number" 
                className="border p-2 rounded w-full"
                value={res.goles} 
                onChange={(e) => handleChangeResultado(index, 'goles', e.target.value)} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block font-semibold mb-1">Amarillas:</label>
                <input 
                  type="number" 
                  className="border p-2 rounded w-full"
                  value={res.amarillas} 
                  onChange={(e) => handleChangeResultado(index, 'amarillas', e.target.value)} 
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Rojas:</label>
                <input 
                  type="number" 
                  className="border p-2 rounded w-full"
                  value={res.rojas} 
                  onChange={(e) => handleChangeResultado(index, 'rojas', e.target.value)} 
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block font-semibold mb-1">Puntos:</label>
              <input 
                type="number" 
                className="border p-2 rounded w-full"
                value={res.puntos} 
                onChange={(e) => handleChangeResultado(index, 'puntos', e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-1">Tipo Resultado:</label>
              <select
                className="border p-2 rounded w-full"
                value={res.tipo_resultado}
                onChange={(e) => handleChangeResultado(index, 'tipo_resultado', e.target.value)}
                required
              >
                <option value="">-- Selecciona tipo --</option>
                <option value="Ganado">Ganado</option>
                <option value="Perdido">Perdido</option>
                <option value="Empatado">Empatado</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4">
        <h3 className="font-bold text-lg mb-3">Goleadores</h3>
        {formData.goleadores.map((gol, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 mb-4 items-end">
            <div className="flex-1 w-full">
              <label className="block font-semibold mb-1">Participante:</label>
              <AutocompleteParticipante
                value={gol.participante_id}
                onChange={val => handleGoleadorChange(index, 'participante_id', val)}
                participantes={participantes}
              />
            </div>
            <div className="w-full md:w-24">
              <label className="block font-semibold mb-1">Goles:</label>
              <input
                type="number"
                className="border p-2 rounded w-full"
                value={gol.goles}
                onChange={e => handleGoleadorChange(index, 'goles', e.target.value)}
                min="1"
              />
            </div>
          </div>
        ))}
        <button 
          type="button" 
          onClick={addGoleador} 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          + Añadir Goleador
        </button>
      </div>

      <div className="mt-6 border-t pt-4">
        <h3 className="font-bold text-lg mb-3">Tarjetas</h3>
        {formData.tarjetas.map((tarjeta, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 mb-4 items-end">
            <div className="flex-1 w-full">
              <label className="block font-semibold mb-1">Participante:</label>
              <AutocompleteParticipante
                value={tarjeta.participante_id}
                onChange={val => handleTarjetaChange(index, 'participante_id', val)}
                participantes={participantes}
              />
            </div>
            <div className="w-full md:w-32">
              <label className="block font-semibold mb-1">Tipo de tarjeta:</label>
              <select 
                className="border p-2 rounded w-full"
                value={tarjeta.tipo}
                onChange={(e) => handleTarjetaChange(index, 'tipo', e.target.value)}
              >
                <option value="">-- Seleccionar tipo --</option>
                <option value="Amarilla">Amarilla</option>
                <option value="Roja">Roja</option>
              </select>
            </div>
          </div>
        ))}
        <button 
          type="button" 
          onClick={addTarjeta} 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          + Añadir Tarjeta
        </button>
      </div>

      <div className="mt-6 flex justify-end">
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium"
        >
          Registrar Resultado
        </button>
      </div>
    </form>
  );
}