import { api } from './api';

export interface TesteAplicado {
  TesteID: number;
  PacienteID: number;
  MedicoID: number;
  NomeMedico: string;
  DataHora: string;
  TipoTeste: string;
  Resultado: string;
}

export const testeService = {
  async getAll() {
    const { data } = await api.get<TesteAplicado[]>('/testes');
    return data;
  },

  // --- ADICIONE ESTE MÉTODO ---
  async delete(testeId: number) {
    await api.delete(`/testes/${testeId}`);
  }
};