import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // Porta definida no seu index.ts do backend
});

// Interceptador: Antes de cada requisição, veja se tem token e anexe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});