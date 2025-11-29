import { api } from './api';

export const authService = {
  async login(email: string, senha: string) {
    // O backend espera { email, senha } na rota /auth/login
    // O backend retorna { token, medico }
    const { data } = await api.post('/auth/login', { email, senha });
    
    // Salvar no navegador
    localStorage.setItem('token', data.token);
    // Salvamos o objeto médico como string para usar depois (ex: mostrar nome no header)
    localStorage.setItem('medico', JSON.stringify(data.medico));
    
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('medico');
    window.location.href = '/';
  }
};