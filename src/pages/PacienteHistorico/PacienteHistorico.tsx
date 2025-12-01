import { useState, useEffect } from 'react';
import { Container, Button, Table, Form, Spinner, Alert } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { FaPlus as Plus } from "react-icons/fa";
import './PacienteHistorico.css';

// Componentes internos
import { PatientEvolutions } from './PatientEvolutions';
import { PatientDocuments } from './PatientDocuments';
import RelatorioPage from '../RelatorioPage/RelatorioPage'; // <--- Importando o Relatório

// Serviços
import { pacienteService, type Paciente } from '../../services/pacienteService';
import { testeService, type TesteAplicado } from '../../services/testeService';

export default function PatientHistory() {
  const { id } = useParams();
  // const navigate = useNavigate(); // Não precisamos mais de navegação externa
  
  const [activeTab, setActiveTab] = useState('evolucoes');
  
  // Estados de dados
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [testes, setTestes] = useState<TesteAplicado[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Busca dados ao carregar
  useEffect(() => {
    if (id) {
      loadData(Number(id));
    }
  }, [id]);

  const loadData = async (pacienteId: number) => {
    try {
      setLoading(true);
      const pacienteData = await pacienteService.getById(pacienteId);
      setPaciente(pacienteData);

      const todosTestes = await testeService.getAll();
      
      // Filtro corrigido
      const testesDoPaciente = todosTestes.filter(t => Number(t.PacienteID) === pacienteId);
      setTestes(testesDoPaciente);

    } catch (error) {
      console.error("Erro ao buscar dados", error);
      setError('Erro ao carregar dados do paciente.');
    } finally {
      setLoading(false);
    }
  };

  // Renderização da tabela de testes (Sem o botão de relatório)
  const renderTestesContent = () => (
    <div className="history-table-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="history-title mb-0">Histórico de testes aplicados</h3>
        
        {/* Botão Único: Novo Teste */}
        <Button variant="primary" className="d-flex align-items-center gap-2">
            <div className="border-white p-0 d-flex align-items-center justify-content-center" style={{width: 20, height: 20}}>
                <Plus size={12} />
            </div>
            Novo teste
        </Button>
      </div>

      <Table hover responsive borderless className="table-custom">
        <thead>
          <tr>
            <th style={{width: '50px'}}><Form.Check type="checkbox" /></th>
            <th>Data</th>
            <th>Tipo de teste</th>
            <th>ID Médico</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          {testes.length === 0 ? (
             <tr><td colSpan={5} className="text-center text-muted">Nenhum teste encontrado para este paciente.</td></tr>
          ) : (
            testes.map((item) => (
              <tr key={item.TesteID}>
                <td><Form.Check type="checkbox" /></td>
                <td>
                    {item.DataHora ? new Date(item.DataHora).toLocaleDateString('pt-BR') : '-'}
                </td>
                <td>{item.TipoTeste || 'Teste Padrão'}</td>
                <td>
                  <div className="professional-cell">
                    <div className="bg-secondary rounded-circle text-white d-flex align-items-center justify-content-center" style={{width:32, height:32, fontSize: 12}}>
                        Dr
                    </div>
                    <span>Médico ID: {item.MedicoID}</span>
                  </div>
                </td>
                <td>
                    {item.Resultado ? (
                        <span className="text-dark">{item.Resultado}</span>
                    ) : (
                        <span className="text-muted font-italic">Sem resultado</span>
                    )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Carregando dados...</span>
      </Container>
    );
  }

  if (error || !paciente) {
    return (
      <Container className="p-5 text-center">
        <Alert variant="danger">{error || 'Paciente não encontrado.'}</Alert>
        <Link to="/pacientes" className="btn btn-secondary">Voltar para lista</Link>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <Link to="/pacientes" className="back-link">
        Pacientes
      </Link>

      {/* Cabeçalho do Paciente */}
      <div className="patient-header">
        <div className="patient-info">
          <img 
            src={`https://ui-avatars.com/api/?name=${paciente.NomeCompleto}&background=random&size=128`}
            alt={paciente.NomeCompleto} 
            className="patient-avatar" 
          />
          <div className="patient-details">
            <h2 className="fw-bold">{paciente.NomeCompleto}</h2>
            <div className="text-secondary">
                <span>{paciente.Email || 'Sem email'}</span> <br/>
                <span>CPF: {paciente.CPF || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="patient-tabs">
        <div 
          className={`tab-item ${activeTab === 'evolucoes' ? 'active' : ''}`} 
          onClick={() => setActiveTab('evolucoes')}
        >
          Evoluções
        </div>
        <div 
          className={`tab-item ${activeTab === 'testes' ? 'active' : ''}`} 
          onClick={() => setActiveTab('testes')}
        >
          Testes e Laudos
        </div>
        <div 
          className={`tab-item ${activeTab === 'documentos' ? 'active' : ''}`} 
          onClick={() => setActiveTab('documentos')}
        >
          Documentos
        </div>
        
        {/* NOVA ABA: RELATÓRIO */}
        <div 
          className={`tab-item ${activeTab === 'relatorio' ? 'active' : ''}`} 
          onClick={() => setActiveTab('relatorio')}
        >
          Relatório
        </div>

        <div 
          className={`tab-item ${activeTab === 'dados' ? 'active' : ''}`} 
          onClick={() => setActiveTab('dados')}
        >
          Dados Cadastrais
        </div>
      </div>

      {/* Conteúdo das Abas */}
      <div className="mt-4">
        {activeTab === 'evolucoes' && <PatientEvolutions />} 
        {activeTab === 'testes' && renderTestesContent()}
        {activeTab === 'documentos' && <PatientDocuments />}
        
        {/* Renderiza o Relatório aqui dentro */}
        {activeTab === 'relatorio' && (
            <div className="fade-in"> 
                <RelatorioPage />
            </div>
        )}

        {activeTab === 'dados' && (
            <div className="p-4 bg-white rounded shadow-sm">
                <h5>Dados Cadastrais</h5>
                <p><strong>Nome:</strong> {paciente.NomeCompleto}</p>
                <p><strong>Telefone:</strong> {paciente.Telefone}</p>
                <p><strong>Endereço:</strong> {paciente.Endereco}</p>
            </div>
        )}
      </div>
    </Container>
  );
}