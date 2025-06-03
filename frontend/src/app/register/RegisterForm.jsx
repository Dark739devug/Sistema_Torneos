"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './RegisterForm.module.css';
import { toast } from 'react-toastify'; // 👉 Importa react-toastify
import 'react-toastify/dist/ReactToastify.css'; // 👉 Importa los estilos de react-toastify

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    nombre_rol: 'Estudiante' 
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/api/registro/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('✅ Usuario registrado exitosamente', {
        position: 'top-center',
        autoClose: 3000
      });
      router.push('/login'); 
    } else {
      toast.error(data.error || '❌ Error al registrar el usuario', {
        position: 'top-center',
        autoClose: 5000
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.title}>Registro</h2>

      <input
        type="text"
        name="nombre"
        placeholder="Nombre de usuario"
        value={formData.nombre}
        onChange={handleChange}
        required
        className={styles.input}
      />
      <input
        type="email"
        name="correo"
        placeholder="Correo electrónico"
        value={formData.correo}
        onChange={handleChange}
        required
        className={styles.input}
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        required
        className={styles.input}
      />

      <select
        name="nombre_rol"
        value={formData.nombre_rol}
        onChange={handleChange}
        required
        className={styles.input}
      >
        <option value="Estudiante">Estudiante</option>
        <option value="Administrador">Administrador</option>
        <option value="Couch">Couch</option>
      </select>

      <button type="submit" className={styles.button}>Registrarse</button>
    </form>
  );
}


