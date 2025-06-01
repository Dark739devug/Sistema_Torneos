"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './RegisterForm.module.css';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    nombre_rol: 'Estudiante' 
  });

  const [message, setMessage] = useState('');
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
      body: JSON.stringify(formData),  // Ahora el JSON usa claves correctas
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Usuario registrado exitosamente');
      router.push('/login'); 
    } else {
      setMessage(JSON.stringify(data));
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
      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
}

