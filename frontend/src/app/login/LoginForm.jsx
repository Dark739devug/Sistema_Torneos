'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoginForm.module.css';
import { AuthContext } from '@/context/AuthContext'; // 🚀 Importa el contexto

export default function LoginForm() {
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });

  const [message, setMessage] = useState('');
  const router = useRouter();
  const { login } = useContext(AuthContext); // 🚀 Usa el login() del contexto

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bodyToSend = {
      correo: formData.correo,
      password: formData.contrasena
    };

    try {
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyToSend),
      });

      const data = await response.json();

      if (response.ok && data.access && data.refresh) {
        // 🚀 Usa el login del contexto para actualizar el estado global Y guardar en localStorage
        login(data);

        setMessage('Inicio de sesión exitoso');

        // Redirige a la página principal o dashboard
        router.push('/dashboard');
      } else {
        const errorMsg = data.detail || data.error || 'Credenciales inválidas';
        setMessage(errorMsg);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMessage('Ocurrió un error. Intenta nuevamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
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
        name="contrasena"
        placeholder="Contraseña"
        value={formData.contrasena}
        onChange={handleChange}
        required
        className={styles.input}
      />
      <button type="submit" className={styles.button}>Iniciar sesión</button>
      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
}


