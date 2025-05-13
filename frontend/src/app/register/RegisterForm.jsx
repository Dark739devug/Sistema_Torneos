'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './RegisterForm.module.css';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const router = useRouter(); // Importante

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Usuario registrado exitosamente');
      router.push('/login'); // Redirige a login
    } else {
      setMessage(JSON.stringify(data));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
           <img
        src="/logo2.png"
        alt="Logo de la página"
        className={styles.logo} 
         // Puedes usar una clase CSS para ajustarla
      />
      <h2 className={styles.title}>Registro</h2>
      <input
        type="text"
        name="username"
        placeholder="Nombre de usuario"
        value={formData.username}
        onChange={handleChange}
        required
        className={styles.input}
      />
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={formData.email}
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
      <button type="submit" className={styles.button}>Registrarse</button>
      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
}
