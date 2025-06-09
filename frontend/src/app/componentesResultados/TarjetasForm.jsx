'use client';
import { useState } from 'react';

export default function TarjetasForm({ partidoId }) {
  const [tarjetas, setTarjetas] = useState([
    { participante_id: '', tipo: '' }
  ]);

  const handleChange = (index, field, value) => {
    const nuevas = [...tarjetas];
    nuevas[index][field] = value;
    setTarjetas(nuevas);
  };

  const agregarTarjeta = () => {
    setTarjetas([...tarjetas, { participante_id: '', tipo: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/tarjetas/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tarjetas.map(t => ({ ...t, partido_id: partidoId })))
      });
      const data = await response.json();
      alert('Tarjetas registradas con éxito.');
    } catch (err) {
      alert('Error al registrar tarjetas.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-bold mb-2">Registrar Tarjetas</h2>
      {tarjetas.map((t, i) => (
        <div key={i} className="mb-2 flex gap-2">
          <input
            type="number"
            placeholder="ID Participante"
            value={t.participante_id}
            onChange={(e) => handleChange(i, 'participante_id', e.target.value)}
            className="border p-1 w-1/2"
            required
          />
          <select
            value={t.tipo}
            onChange={(e) => handleChange(i, 'tipo', e.target.value)}
            className="border p-1 w-1/2"
            required
          >
            <option value="">Tipo</option>
            <option value="Amarilla">Amarilla</option>
            <option value="Roja">Roja</option>
          </select>
        </div>
      ))}
      <button type="button" onClick={agregarTarjeta} className="text-blue-600">+ Añadir otra</button>
      <br />
      <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-1 rounded">Guardar</button>
    </form>
  );
}