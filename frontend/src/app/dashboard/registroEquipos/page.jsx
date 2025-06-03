'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import FormEquipo from '@/app/componentesEquipos/FormEquipo';
import ListaEquipos from '@/app/componentesEquipos/ListaEquipos';

export default function EquiposPage() {
  const [recargar, setRecargar] = useState(false);
  const [equipoEdit, setEquipoEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEquipoActualizado = () => {
    setRecargar(!recargar);
    setShowForm(false);
    setEquipoEdit(null);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', marginTop: '30px' }}>
      <Sidebar />
      
      <div style={{ flex: 1, padding: '2rem', background: '#f4f4f4' }}>
        <div className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Registro de Equipos</h1>
            <button
              onClick={() => {
                setEquipoEdit(null);
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Registrar Nuevo Equipo
            </button>
          </div>

          {showForm && (
            <div className="mb-8">
              <FormEquipo
                equipo={equipoEdit}
                onEquipoActualizado={handleEquipoActualizado}
                onCerrar={() => setShowForm(false)}
              />
            </div>
          )}

          <ListaEquipos 
            recargar={recargar} 
            onEditar={(equipo) => {
              setEquipoEdit(equipo);
              setShowForm(true);
            }} 
          />
        </div>
      </div>
    </div>
  );
}
