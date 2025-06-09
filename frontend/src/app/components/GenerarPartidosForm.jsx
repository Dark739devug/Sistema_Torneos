import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaArrowRight } from "react-icons/fa";

export default function GenerarPartidosForm({ onClose, idTorneo, nombreTorneo }) {
  const diasPorDefecto = ["Martes", "Jueves"];
  const horariosPorDefecto = {
    "Martes": [
      { hora: "14:00", cancha: "A" },
      { hora: "15:30", cancha: "B" }
    ],
    "Jueves": [
      { hora: "14:00", cancha: "A" },
      { hora: "15:30", cancha: "B" }
    ]
  };

  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [horariosPorDia, setHorariosPorDia] = useState({});
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [numJornadaActual, setNumJornadaActual] = useState(1);

  const diasSemana = [
    "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
  ];

  useEffect(() => {
    setDiasSeleccionados(diasPorDefecto);
    setHorariosPorDia(horariosPorDefecto);
  }, []);

  const toggleDia = (dia) => {
    setDiasSeleccionados((prev) =>
      prev.includes(dia)
        ? prev.filter((d) => d !== dia)
        : [...prev, dia]
    );
    if (!horariosPorDia[dia]) {
      setHorariosPorDia((prev) => ({
        ...prev,
        [dia]: [{ hora: "14:00", cancha: "A" }]
      }));
    }
  };

  const actualizarHorario = (dia, index, nuevaHora) => {
    setHorariosPorDia((prev) => {
      const horariosDia = prev[dia] || [];
      const nuevosHorarios = [...horariosDia];
      nuevosHorarios[index] = { ...nuevosHorarios[index], hora: nuevaHora };
      return { ...prev, [dia]: nuevosHorarios };
    });
  };

  const actualizarCancha = (dia, index, nuevaCancha) => {
    setHorariosPorDia((prev) => {
      const horariosDia = prev[dia] || [];
      const nuevosHorarios = [...horariosDia];
      nuevosHorarios[index] = { ...nuevosHorarios[index], cancha: nuevaCancha };
      return { ...prev, [dia]: nuevosHorarios };
    });
  };

  const agregarOtroHorario = (dia) => {
    setHorariosPorDia((prev) => ({
      ...prev,
      [dia]: [...(prev[dia] || []), { hora: "14:00", cancha: "A" }]
    }));
  };

  const eliminarHorario = (dia, index) => {
    setHorariosPorDia((prev) => {
      const nuevosHorarios = (prev[dia] || []).filter((_, i) => i !== index);
      return { ...prev, [dia]: nuevosHorarios };
    });
  };

  const calcularHoraFin = (horaInicio) => {
    if (!horaInicio) return "00:00";
    const [hora, minuto] = horaInicio.split(":").map(Number);
    const inicioEnMin = hora * 60 + minuto;
    const finEnMin = inicioEnMin + 90;
    const horaFin = Math.floor(finEnMin / 60);
    const minutoFin = finEnMin % 60;
    return `${horaFin.toString().padStart(2, "0")}:${minutoFin.toString().padStart(2, "0")}`;
  };

  const verificarSlotsNecesarios = async () => {
    const response = await fetch(`http://127.0.0.1:8000/api/contar-partidos-necesarios/?torneo=${idTorneo}&jornada=${numJornadaActual}`);
    const data = await response.json();
    return data.partidos_necesarios;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const partidosNecesarios = await verificarSlotsNecesarios();

      const slotsGenerados = diasSeleccionados.flatMap((dia) => horariosPorDia[dia] || []);

      if (slotsGenerados.length < partidosNecesarios) {
        alert(`Se necesitan ${partidosNecesarios} slots, pero solo has agregado ${slotsGenerados.length}. Agrega más horarios.`);
        setCargando(false);
        return;
      }

      const data = {
        dias: diasSeleccionados.flatMap((dia) => {
          return (horariosPorDia[dia] || []).map(({ hora, cancha }) => {
            const horaFin = calcularHoraFin(hora);
            return { 
              dia, 
              hora_inicio: hora, 
              hora_fin: horaFin, 
              cancha 
            };
          });
        }),
        torneo: parseInt(idTorneo),
        jornada: numJornadaActual
      };

      const response = await fetch("http://127.0.0.1:8000/api/crear-partidos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const resultado = await response.json();

      if (response.ok) {
        setResultados({
          jornada: resultado.jornada,
          partidos: resultado.partidos
        });
        setNumJornadaActual(prev => prev + 1);
      } else {
        alert(`Error: ${resultado.error || "No se pudo generar los partidos"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  // Función optimizada para avanzar a la siguiente jornada
  const handleSiguienteJornada = () => {
    setResultados(null); // Limpiamos los resultados actuales
    // Mantenemos la misma configuración para la próxima jornada
  };

  const formatearHoraAMPM = (hora24) => {
    if (!hora24) return "";
    const [hora, minuto] = hora24.split(":");
    let h = parseInt(hora, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minuto} ${ampm}`;
  };

  const formatearFecha = (fechaStr) => {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
  };
  
  return (
    <div className="p-4 bg-gray-100 rounded shadow max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-center">
          Generar Partidos para:{" "}
          <span className="text-blue-600">{nombreTorneo}</span>
        </h2>
        
        <div className="bg-yellow-100 px-3 py-1 rounded-full text-sm font-semibold">
          Jornada: {numJornadaActual}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="mb-3 font-medium">Días para los partidos y horarios:</p>
          <div className="grid grid-cols-2 gap-4">
            {diasSemana.map((dia) => (
              <div key={dia} className="border rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={diasSeleccionados.includes(dia)}
                    onChange={() => toggleDia(dia)}
                    className="h-5 w-5 text-blue-600"
                  />
                  <span className="font-semibold">{dia}</span>
                </div>

                {diasSeleccionados.includes(dia) && (
                  <div className="ml-2">
                    {(horariosPorDia[dia] || []).map((horario, idx) => {
                      const horaFin = calcularHoraFin(horario.hora);
                      return (
                        <div key={idx} className="flex flex-wrap gap-2 mb-3 items-center">
                          <input
                            type="time"
                            value={horario.hora}
                            onChange={(e) => actualizarHorario(dia, idx, e.target.value)}
                            className="border rounded px-2 py-1 w-28"
                          />
                          <span className="text-gray-500">a</span>
                          <input
                            type="time"
                            value={horaFin}
                            disabled
                            className="border rounded px-2 py-1 bg-gray-100 text-gray-600 w-28"
                          />
                          <select
                            value={horario.cancha}
                            onChange={(e) => actualizarCancha(dia, idx, e.target.value)}
                            className="border rounded px-2 py-1 w-24"
                          >
                            <option value="A">Cancha A</option>
                            <option value="B">Cancha B</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => eliminarHorario(dia, idx)}
                            className="text-red-500 hover:text-red-700 text-lg"
                            title="Eliminar horario"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => agregarOtroHorario(dia)}
                      className="mt-1 text-sm flex items-center bg-green-600 text-white rounded px-2 py-1 hover:bg-green-700 transition"
                    >
                      <FaPlus className="mr-1" /> Agregar Horario
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-2">
          <button
            type="submit"
            disabled={cargando}
            className={`px-6 py-2 rounded font-medium ${
              cargando 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {cargando ? 'Generando...' : 'Generar Partidos'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
        </div>
      </form>

      {resultados && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">
              Partidos Generados - Jornada {resultados.jornada}
            </h3>
            
            <button
              onClick={handleSiguienteJornada}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Siguiente Jornada <FaArrowRight />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Horario</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cancha</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Partido</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resultados.partidos.map((p, idx) => {
                  const [horaInicio, horaFin] = p.hora.split(' a ');
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">{formatearFecha(p.fecha)}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {formatearHoraAMPM(horaInicio)} - {formatearHoraAMPM(horaFin)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{p.cancha}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{p.equipos}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 