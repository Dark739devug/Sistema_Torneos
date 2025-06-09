'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function RegistroParticipante() {
  const [formData, setFormData] = useState({
    carnet: '',
    nombre_estudiante: '',
    apellido_estudiante: '',
    carrera_estudiante: '',
    semestre_estudiante: '',
    equipo: ''
  });

  const [equipos, setEquipos] = useState([]);
  const carreras = [
    'Ingeniería en Sistemas',
    'Administración de Empresas',
    'Derecho',
    'Contaduría Pública',
    'Ingeniería Civil'
  ];

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/equipos/');
        const data = await response.json();
        setEquipos(data);
      } catch (error) {
        console.error('Error al cargar equipos:', error);
        toast.error('Error al cargar equipos');
      }
    };
    fetchEquipos();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      carnet: formData.carnet,
      nombre_estudiante: formData.nombre_estudiante,
      apellido_estudiante: formData.apellido_estudiante,
      carrera_estudiante: formData.carrera_estudiante,
      semestre_estudiante: formData.semestre_estudiante,
      estado_activo: true,
      equipo: formData.equipo ? parseInt(formData.equipo) : null
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/participantes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      const text = await response.text();
      console.log('Respuesta del backend:', text);

      if (response.ok) {
        toast.success('Participante registrado con éxito');
        setFormData({
          carnet: '',
          nombre_estudiante: '',
          apellido_estudiante: '',
          carrera_estudiante: '',
          semestre_estudiante: '',
          equipo: ''
        });
      } else {
        toast.error('Error al registrar participante: ' + text);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error al registrar participante.');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md mt-8 transition-all hover:shadow-lg">
        <h2 className="text-xl font-bold text-center text-green-700 mb-4">Registrar Participante</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-semibold text-gray-700">Carnet</label>
            <input
              type="text"
              name="carnet"
              value={formData.carnet}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-green-400 transition"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Nombre estudiante</label>
            <input
              type="text"
              name="nombre_estudiante"
              value={formData.nombre_estudiante}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-green-400 transition"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Apellido estudiante</label>
            <input
              type="text"
              name="apellido_estudiante"
              value={formData.apellido_estudiante}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-green-400 transition"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Carrera estudiante</label>
            <select
              name="carrera_estudiante"
              value={formData.carrera_estudiante}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-green-400 transition"
              required
            >
              <option value="">-- Selecciona una carrera --</option>
              {carreras.map((carrera, idx) => (
                <option key={idx} value={carrera}>{carrera}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Semestre estudiante</label>
            <input
              type="text"
              name="semestre_estudiante"
              value={formData.semestre_estudiante}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-green-400 transition"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Equipo</label>
            <select
              name="equipo"
              value={formData.equipo}
              onChange={handleChange}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring focus:border-green-400 transition"
              required
            >
              <option value="">-- Selecciona un equipo --</option>
              {equipos.map((eq) => (
                <option key={eq.id} value={eq.id}>{eq.nombre_equipo}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition transform hover:scale-105"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}


    
