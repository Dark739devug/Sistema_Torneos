'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';

import {
  FaTachometerAlt,
  FaTrophy,
  FaCalendarAlt,
  FaUsers,
  FaClipboardList,
  FaTable
} from "react-icons/fa";

const iconos = {
  Dashboard: <FaTachometerAlt />,
  Torneos: <FaTrophy />,
  calendario: <FaCalendarAlt />,
  registroEquipos: <FaUsers />,
  resultados: <FaClipboardList />,
  tablaPosiciones: <FaTable />,
  participantes: <FaUsers />,
  aprobacion: <FaClipboardList />
};

const rutasPorRol = {
  Administrador: [
    { name: 'Dashboard', path: '/dashboard', icon: iconos.Dashboard },
    { name: 'Torneos', path: '/dashboard/Torneos', icon: iconos.Torneos },
    { name: 'Calendario', path: '/dashboard/calendario', icon: iconos.calendario },
    { name: 'Registro de Equipos', path: '/dashboard/registroEquipos', icon: iconos.registroEquipos },
    { name: 'Registro de Participantes', path: '/dashboard/registroParticipantes', icon: iconos.participantes },
    { name: 'Aprobación de Inscripciones', path: '/dashboard/aprobacionInscripciones', icon: iconos.aprobacion },
    { name: 'Registro de Resultados', path: '/dashboard/resultados', icon: iconos.resultados },
    { name: 'Tabla de Posiciones', path: '/dashboard/tablaPosiciones', icon: iconos.tablaPosiciones },
    { name: 'Estadísticas', path: '/dashboard/estadisticas', icon: <FaClipboardList /> }
  ],
  Couch: [
    { name: 'Dashboard', path: '/dashboard', icon: iconos.Dashboard },
    { name: 'Torneos', path: '/dashboard/torneosvista', icon: iconos.Torneos },
    { name: 'Calendario', path: '/dashboard/calendario', icon: iconos.calendario },
    { name: 'Registro de Equipos', path: '/dashboard/registroEquipos', icon: iconos.registroEquipos },
    { name: 'Registro de Participantes', path: '/dashboard/registroParticipantes', icon: iconos.participantes },
    { name: 'Tabla de Posiciones', path: '/dashboard/tablaPosiciones', icon: iconos.tablaPosiciones },
    { name: 'Estadísticas', path: '/dashboard/estadisticas', icon: <FaClipboardList /> }
  ],
  Estudiante: [
    { name: 'Dashboard', path: '/dashboard', icon: iconos.Dashboard },
    { name: 'Torneos', path: '/dashboard/torneosvista', icon: iconos.Torneos },
    { name: 'Equipos disponibles', path: '/dashboard/Equiposdisponibles', icon: iconos.registroEquipos },
    { name: 'Calendario', path: '/dashboard/calendario', icon: iconos.calendario },
    { name: 'Tabla de Posiciones', path: '/dashboard/tablaPosiciones', icon: iconos.tablaPosiciones },
    { name: 'Registro de Participantes', path: '/dashboard/registroParticipantes', icon: iconos.participantes },
    { name: 'Tabla de Posiciones', path: '/dashboard/tablaPosiciones', icon: iconos.tablaPosiciones },
    { name: 'Estadísticas', path: '/dashboard/estadisticas', icon: <FaClipboardList /> }
  ]
};

const Sidebar = () => {
  const router = useRouter();
  const [rolUsuario, setRolUsuario] = useState('Estudiante');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rol = localStorage.getItem('rol') || 'Estudiante';
      setRolUsuario(rol);
    }
  }, []);

  const opcionesSidebar = rutasPorRol[rolUsuario] || [];

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className={styles.sidebarContainer}>
      {opcionesSidebar.map((route, index) => (
        <div
          key={index}
          className={styles.menuItem}
          onClick={() => handleNavigation(route.path)}
        >
          <span className={styles.icon}>{route.icon}</span>
          <span className={styles.title}>{route.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
