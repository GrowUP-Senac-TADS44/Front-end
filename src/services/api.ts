import axios from 'axios';

export const api = axios.create({
  // Tenta pegar a variável do ambiente (Vercel), se não achar, usa localhost (PC)
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', 
});

// Interceptador: Antes de cada requisição, veja se tem token e anexe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
