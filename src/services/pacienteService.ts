import { api } from './api';

// Interface baseada no retorno do Prisma (Backend)
export interface Paciente {
  PacienteID: number;
  NomeCompleto: string;
  DataNascimento: string | null;
  CPF: string | null;
  Telefone: string | null;
  Email: string | null;
  Endereco: string | null;
  // Adicione outros campos se necessário
}

export const pacienteService = {
  // Lista todos os pacientes
  async getAll() {
    const { data } = await api.get<Paciente[]>('/pacientes');
    return data;
  },

  // Busca um paciente específico pelo ID
  async getById(id: number) {
    const { data } = await api.get<Paciente>(`/pacientes/${id}`);
    return data;
  },

  // Cria um novo paciente (preparando para o futuro)
  async create(payload: Partial<Paciente>) {
    const { data } = await api.post('/pacientes', payload);
    return data;
  }
};