'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';

import {
  FaTrophy,
  FaCalendarAlt,
  FaUsers,
  FaClipboardList,
  FaTable
} from "react-icons/fa";

const iconos = {
  Torneos: <FaTrophy />,
  calendario: <FaCalendarAlt />,
  registroEquipos: <FaUsers />,
  resultados: <FaClipboardList />,
  tablaPosiciones: <FaTable />
};

const routes = [
  { name: 'Torneos', path: '/dashboard/Torneos', icon: iconos.Torneos },
  { name: 'Calendario', path: '/dashboard/calendario', icon: iconos.calendario },
  { name: 'Registro de Equipos', path: '/dashboard/registroEquipos', icon: iconos.registroEquipos },
  { name: 'Resultados', path: '/dashboard/resultados', icon: iconos.resultados },
  { name: 'Tabla de Posiciones', path: '/dashboard/tablaPosiciones', icon: iconos.tablaPosiciones },
  { name: 'Estadísticas', path: '/dashboard/estadisticas', icon: <FaClipboardList /> }  // ✅ Nuevo ítem
];

const Sidebar = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className={styles.sidebarContainer}>
      {routes.map((route, index) => (
        <div
          key={index}
          className={styles.menuItem}
          onClick={() => handleNavigation(route.path)}
        >
          <span className={styles.icon}>{route.icon}</span>
          <span className={styles.title}>{route.name}</span> {/* ✅ Usar "name" */}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
