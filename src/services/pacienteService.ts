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
}

// Interface para as Evoluções
export interface Evolucao {
  id: number;
  date: string;
  time: string;
  doctor: string;
  description: string;
}

// --- FALTAVA ESTA INTERFACE ---
export interface Documento {
  id: number;
  name: string;
  date: string;
  type: string;
  filePath: string;
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

  // Busca as evoluções
  async getEvolucoes(pacienteId: number) {
    const { data } = await api.get<Evolucao[]>(`/pacientes/${pacienteId}/evolucoes`);
    return data;
  },

  // Busca os documentos
  async getDocumentos(pacienteId: number) {
    const { data } = await api.get<Documento[]>(`/pacientes/${pacienteId}/documentos`);
    return data;
  },

  // Cria um novo paciente
  async create(payload: Partial<Paciente>) {
    const { data } = await api.post('/pacientes', payload);
    return data;
  }
};