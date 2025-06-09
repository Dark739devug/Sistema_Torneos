'use client';

import DashboardLayout from '@/layouts/DashboardLayout'; // Ajusta la ruta si es necesario
import VistaEstadisticasPublica from '@/app/componentesResultados/VistaEstadisticasTorneo';

export default function EstadisticasPage() {
  const torneoId = 1; // Cambia este valor por el ID real del torneo

  return (
    <DashboardLayout>
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-6">Estadísticas del Torneo</h1>
        <VistaEstadisticasPublica torneoId={torneoId} />
      </main>
    </DashboardLayout>
  );
}

