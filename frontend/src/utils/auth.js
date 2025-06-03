// utils/auth.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const fetchWithAuth = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('/') 
    ? `${API_BASE_URL}${endpoint}`
    : `${API_BASE_URL}/${endpoint}`;

  const token = localStorage.getItem('token'); // o tu método de almacenamiento de token

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error en la solicitud');
    }

    return response;
  } catch (error) {
    console.error('Error en fetchWithAuth:', error);
    throw error;
  }
};