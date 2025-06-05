'use client';

import FormEquipo from '@/app/componentesEquipos/FormEquipo';
import ListaEquipos from '@/app/componentesEquipos/ListaEquipos';
import DashboardLayout from '@/layouts/DashboardLayout';;
import { useState } from 'react';

export default function EquiposPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [equipoAEditar, setEquipoAEditar] = useState(null);
  const [recargar, setRecargar] = useState(false);

  const abrirFormularioCrear = () => {
    setEquipoAEditar(null);
    setMostrarFormulario(true);
  };

  const abrirModalEdicion = (equipo) => {
    setEquipoAEditar(equipo);
    setMostrarFormulario(true);
  };

  const cerrarModal = () => {
    setMostrarFormulario(false);
    setEquipoAEditar(null);
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '2rem' }}>
        <h1>Equipos</h1>
        <button
          onClick={abrirFormularioCrear}
          style={{
            background: '#0070f3',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          Nuevo Equipo
        </button>

        <ListaEquipos recargar={recargar} onEditar={abrirModalEdicion} />

        {mostrarFormulario && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}>
            <div style={{ background: '#fff', borderRadius: '8px', padding: '2rem', maxWidth: '500px', width: '90%' }}>
              <FormEquipo
                equipo={equipoAEditar}
                onCerrar={cerrarModal}
                onEquipoActualizado={() => {
                  cerrarModal();
                  setRecargar(!recargar);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
