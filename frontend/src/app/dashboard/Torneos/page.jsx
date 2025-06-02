'use client';

import DashboardLayout from '@/layouts/DashboardLayout';
import FormularioTorneo from '@/app/components/FormularioTorneo';
import ListaTorneos from '@/app/components/ListaTorneos';
import { useState } from 'react';

export default function CampeonatosPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [torneoAEditar, setTorneoAEditar] = useState(null);
  const [recargar, setRecargar] = useState(false);

  const abrirFormularioCrear = () => {
    setTorneoAEditar(null);
    setMostrarFormulario(true);
  };

  const abrirModalEdicion = (torneo) => {
    setTorneoAEditar(torneo);
    setMostrarFormulario(true);
  };

  const cerrarModal = () => {
    setMostrarFormulario(false);
    setTorneoAEditar(null);
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '2rem' }}>
        <h1>Campeonatos</h1>
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
          Nuevo Torneo
        </button>

        <ListaTorneos recargar={recargar} onEditar={abrirModalEdicion} />

        {mostrarFormulario && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}>
            <div style={{ background: '#fff', borderRadius: '8px', padding: '2rem', maxWidth: '500px', width: '90%' }}>
              <FormularioTorneo
                torneo={torneoAEditar}
                onCerrar={cerrarModal}
                onTorneoActualizado={() => {
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
