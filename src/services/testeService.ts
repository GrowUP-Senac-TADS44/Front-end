import { api } from './api';

export interface TesteAplicado {
  TesteID: number;
  PacienteID: number; // Precisamos disso para saber de quem é o teste
  MedicoID: number;
  DataHora: string;
  TipoTeste: string; // Ou o nome do campo correto no seu banco
  Resultado: string;
  // Adicione outros campos que seu banco retorna
}

export const testeService = {
  async getAll() {
    // Busca TODOS os testes do sistema
    const { data } = await api.get<TesteAplicado[]>('/testes');
    return data;
  }
};