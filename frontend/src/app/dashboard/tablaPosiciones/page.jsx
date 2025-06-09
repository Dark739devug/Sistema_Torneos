'use client';

import DashboardLayout from '@/layouts/DashboardLayout'; // Ajusta la ruta si es necesario
import TablaPosicionesGeneral from '@/app/componentesResultados/tablaposicion';

export default function TablaPosicionesPage() {
  const torneoId = 1; // ✅ Reemplaza por el ID real si es dinámico

  return (
    <DashboardLayout>
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-6">Tabla de Posiciones</h1>
        <TablaPosicionesGeneral torneoId={torneoId} />
      </main>
    </DashboardLayout>
  );
}
