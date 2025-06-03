'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });

  const router = useRouter();
  const { login } = useContext(AuthContext);

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

      // ✅ Ajustamos los campos que devuelve tu backend
      if (response.ok && data.access && data.refresh && data.nombre) {
        // Guarda el nombre y rol en localStorage (si quieres)
        localStorage.setItem('usuario', data.nombre);
        localStorage.setItem('rol', data.rol);

        // Llama al login del AuthContext
        login(data);

        // Guarda el token en la cookie
        Cookies.set('token', data.access, {
          expires: 1,
          path: '/',
          sameSite: 'strict'
        });

        // Muestra el toast de éxito
        toast.success('✅ Inicio de sesión exitoso', { position: 'top-center' });

        // Redirige al dashboard
        router.push('/dashboard');
      } else {
        const errorMsg = data.detail || data.error || 'Credenciales inválidas';
        toast.error(errorMsg, { position: 'top-center' });
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error('❌ Ocurrió un error. Intenta nuevamente.', { position: 'top-center' });
    }
  };

  return (
    <>
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
      </form>

  
    </>
  );
}



