import { api } from './api';

export interface Paciente {
  PacienteID: number;
  NomeCompleto: string;
  DataNascimento: string | null;
  CPF: string | null;
  Telefone: string | null;
  Email: string | null;
  Endereco: string | null;
  EstadoCivil?: string | null;
  NomeContatoEmergencia?: string | null;
  TelefoneContatoEmergencia?: string | null;
}

export interface Evolucao {
  id: number;
  date: string;
  time: string;
  doctor: string;
  description: string;
}

export interface Documento {
  id: number;
  name: string;
  date: string;
  type: string;
  filePath: string;
}

// --- NOVA INTERFACE ---
export interface Prontuario {
  ProntuarioID: number;
  ResumoFinal: string | null;
}

export const pacienteService = {
  async getAll() {
    const { data } = await api.get<Paciente[]>('/pacientes');
    return data;
  },

  async getById(id: number) {
    const { data } = await api.get<Paciente>(`/pacientes/${id}`);
    return data;
  },

  async getEvolucoes(pacienteId: number) {
    const { data } = await api.get<Evolucao[]>(`/pacientes/${pacienteId}/evolucoes`);
    return data;
  },

  async getDocumentos(pacienteId: number) {
    const { data } = await api.get<Documento[]>(`/pacientes/${pacienteId}/documentos`);
    return data;
  },

  async create(payload: Partial<Paciente>) {
    const { data } = await api.post('/pacientes', payload);
    return data;
  },

  // --- NOVOS MÉTODOS ---
  async getProntuarioAtivo(pacienteId: number) {
    const { data } = await api.get<Prontuario>(`/pacientes/${pacienteId}/prontuario-ativo`);
    return data;
  },

  async saveLaudo(pacienteId: number, texto: string) {
     const { data } = await api.put(`/pacientes/${pacienteId}/laudo`, { texto });
     return data;
  },

  async update(id: number, payload: Partial<Paciente>) {
    const { data } = await api.put(`/pacientes/${id}`, payload);
    return data;
  },

  async deleteDocumento(documentoId: number) {
    await api.delete(`/documentos/${documentoId}`);
  },

  // Cria uma nova evolução
  async createEvolucao(payload: any) {
    // payload deve conter: { ProntuarioID, MedicoID, DataHoraInicio, ResumoConsulta }
    const { data } = await api.post('/consultas', payload);
    return data;
  },

  // Atualiza uma evolução existente
  async updateEvolucao(consultaId: number, payload: any) {
    const { data } = await api.put(`/consultas/${consultaId}`, payload);
    return data;
  },

  // Exclui uma evolução
  async deleteEvolucao(consultaId: number) {
    await api.delete(`/consultas/${consultaId}`);
  }
};