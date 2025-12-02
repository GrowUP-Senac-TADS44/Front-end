import { useState, useEffect } from 'react';
import { Container, Button, Table, Form, Spinner, Alert, Modal, Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { FaPlus as Plus, FaTrash } from "react-icons/fa"; // Adicionei FaTrash
import { FiEdit } from 'react-icons/fi';
import './PacienteHistorico.css';

// Componentes internos
import { PatientEvolutions } from './PatientEvolutions';
import { PatientDocuments } from './PatientDocuments';
import RelatorioPage from '../RelatorioPage/RelatorioPage';

// Serviços
import { pacienteService, type Paciente } from '../../services/pacienteService';
import { testeService, type TesteAplicado } from '../../services/testeService';

// --- FUNÇÕES UTILITÁRIAS DE FORMATAÇÃO ---
const formatCPF = (cpf: string | null | undefined) => {
  if (!cpf) return '-';
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cleaned;
};

const formatTelefone = (tel: string | null | undefined) => {
  if (!tel) return '-';
  const cleaned = tel.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return cleaned;
};

export default function PatientHistory() {
  const { id } = useParams();
  
  const [activeTab, setActiveTab] = useState('evolucoes');
  
  // Estados de dados
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [testes, setTestes] = useState<TesteAplicado[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- ESTADOS PARA O MODAL DE EDIÇÃO (PACIENTE) ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    NomeCompleto: '', CPF: '', DataNascimento: '', Telefone: '', Email: '',
    Endereco: '', EstadoCivil: '', NomeContatoEmergencia: '', TelefoneContatoEmergencia: ''
  });

  // --- NOVOS ESTADOS PARA O MODAL DE EXCLUSÃO (TESTE) ---
  const [showDeleteTestModal, setShowDeleteTestModal] = useState(false);
  const [testToDelete, setTestToDelete] = useState<number | null>(null);
  const [deletingTest, setDeletingTest] = useState(false);

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
      const testesDoPaciente = todosTestes.filter(t => Number(t.PacienteID) === pacienteId);
      setTestes(testesDoPaciente);

    } catch (error) {
      console.error("Erro ao buscar dados", error);
      setError('Erro ao carregar dados do paciente.');
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE EDIÇÃO (PACIENTE) ---
  const handleOpenEdit = () => {
    if (!paciente) return;
    let dataFormatada = '';
    if (paciente.DataNascimento) {
      dataFormatada = new Date(paciente.DataNascimento).toISOString().split('T')[0];
    }
    setEditForm({
      NomeCompleto: paciente.NomeCompleto,
      CPF: paciente.CPF || '',
      DataNascimento: dataFormatada,
      Telefone: paciente.Telefone || '',
      Email: paciente.Email || '',
      Endereco: paciente.Endereco || '',
      EstadoCivil: paciente.EstadoCivil || '',
      NomeContatoEmergencia: paciente.NomeContatoEmergencia || '',
      TelefoneContatoEmergencia: paciente.TelefoneContatoEmergencia || ''
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paciente || !id) return;
    setEditSaving(true);
    try {
      const payload = {
        ...editForm,
        CPF: editForm.CPF.replace(/\D/g, ''),
        DataNascimento: new Date(editForm.DataNascimento).toISOString()
      };
      await pacienteService.update(Number(id), payload);
      alert('Dados atualizados com sucesso!');
      setShowEditModal(false);
      loadData(Number(id)); 
    } catch (err) {
      alert('Erro ao atualizar paciente. Verifique os dados.');
    } finally {
      setEditSaving(false);
    }
  };

  // --- LÓGICA DE EXCLUSÃO (TESTE) ---
  const confirmDeleteTest = (testeId: number) => {
    setTestToDelete(testeId);
    setShowDeleteTestModal(true);
  };

  const handleDeleteTest = async () => {
    if (!testToDelete) return;
    setDeletingTest(true);
    try {
      await testeService.delete(testToDelete);
      // Remove visualmente da lista
      setTestes(testes.filter(t => t.TesteID !== testToDelete));
      setShowDeleteTestModal(false);
    } catch (err) {
      alert('Erro ao excluir o teste.');
    } finally {
      setDeletingTest(false);
      setTestToDelete(null);
    }
  };

  // Renderização da tabela de testes
  const renderTestesContent = () => (
    <div className="history-table-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="history-title mb-0">Histórico de testes aplicados</h3>
        
        <Button variant="primary" className="d-flex align-items-center gap-2">
            <div className="border-white p-0 d-flex align-items-center justify-content-center" style={{width: 20, height: 20}}>
                <Plus size={12} />
            </div>
            Novo teste
        </Button>
      </div>

      <Table hover responsive borderless className="table-custom align-middle">
        <thead>
          <tr>
            <th style={{width: '50px'}}><Form.Check type="checkbox" /></th>
            <th>Data</th>
            <th>Tipo de teste</th>
            <th>Médico</th>
            <th>Resultado</th>
            <th className="text-end">Ações</th> {/* Nova Coluna */}
          </tr>
        </thead>
        <tbody>
          {testes.length === 0 ? (
             <tr><td colSpan={6} className="text-center text-muted">Nenhum teste encontrado para este paciente.</td></tr>
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
                        {item.NomeMedico ? item.NomeMedico.charAt(0) : 'D'}
                    </div>
                    <span className="fw-medium">
                        {item.NomeMedico || `Médico ID: ${item.MedicoID}`}
                    </span>
                  </div>
                </td>
                <td>
                    {item.Resultado ? (
                        <span className="text-dark">{item.Resultado}</span>
                    ) : (
                        <span className="text-muted font-italic">Sem resultado</span>
                    )}
                </td>
                
                {/* COLUNA DE AÇÕES (LIXEIRA) */}
                <td className="text-end">
                    <FaTrash 
                        style={{cursor: 'pointer', color: '#d93025'}} 
                        title="Excluir Teste"
                        onClick={() => confirmDeleteTest(item.TesteID)}
                    />
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
                <span>CPF: {formatCPF(paciente.CPF)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="patient-tabs">
        <div className={`tab-item ${activeTab === 'evolucoes' ? 'active' : ''}`} onClick={() => setActiveTab('evolucoes')}>Evoluções</div>
        <div className={`tab-item ${activeTab === 'testes' ? 'active' : ''}`} onClick={() => setActiveTab('testes')}>Testes aplicados</div>
        <div className={`tab-item ${activeTab === 'documentos' ? 'active' : ''}`} onClick={() => setActiveTab('documentos')}>Documentos</div>
        <div className={`tab-item ${activeTab === 'relatorio' ? 'active' : ''}`} onClick={() => setActiveTab('relatorio')}>Relatório</div>
        <div className={`tab-item ${activeTab === 'dados' ? 'active' : ''}`} onClick={() => setActiveTab('dados')}>Dados Cadastrais</div>
      </div>

      <div className="mt-4">
        {activeTab === 'evolucoes' && <PatientEvolutions />} 
        {activeTab === 'testes' && renderTestesContent()}
        {activeTab === 'documentos' && <PatientDocuments />}
        
        {activeTab === 'relatorio' && (
            <div className="fade-in"> 
                <RelatorioPage />
            </div>
        )}

        {activeTab === 'dados' && (
            <div className="p-4 bg-white rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                    <h5 className="text-primary mb-0">Dados Pessoais</h5>
                    <Button variant="outline-primary" size="sm" onClick={handleOpenEdit} className="d-flex align-items-center gap-2">
                        <FiEdit /> Editar Dados
                    </Button>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6 mb-2">
                        <small className="text-secondary d-block">Nome Completo</small>
                        <strong>{paciente.NomeCompleto}</strong>
                    </div>
                    <div className="col-md-3 mb-2">
                        <small className="text-secondary d-block">CPF</small>
                        <strong>{formatCPF(paciente.CPF)}</strong>
                    </div>
                    <div className="col-md-3 mb-2">
                        <small className="text-secondary d-block">Data de Nascimento</small>
                        <strong>{paciente.DataNascimento ? new Date(paciente.DataNascimento).toLocaleDateString('pt-BR') : '-'}</strong>
                    </div>
                    <div className="col-md-3 mb-2">
                        <small className="text-secondary d-block">Estado Civil</small>
                        <strong>{paciente.EstadoCivil || '-'}</strong>
                    </div>
                </div>

                <h5 className="mb-3 text-primary border-bottom pb-2">Contato e Endereço</h5>
                <div className="row mb-4">
                    <div className="col-md-4 mb-2">
                        <small className="text-secondary d-block">E-mail</small>
                        <strong>{paciente.Email || '-'}</strong>
                    </div>
                    <div className="col-md-3 mb-2">
                        <small className="text-secondary d-block">Telefone</small>
                        <strong>{formatTelefone(paciente.Telefone)}</strong>
                    </div>
                    <div className="col-md-5 mb-2">
                        <small className="text-secondary d-block">Endereço</small>
                        <strong>{paciente.Endereco || '-'}</strong>
                    </div>
                </div>

                <h5 className="mb-3 text-danger border-bottom pb-2">Em Caso de Emergência</h5>
                <div className="row">
                    <div className="col-md-4 mb-2">
                        <small className="text-secondary d-block">Nome do Contato</small>
                        <strong>{paciente.NomeContatoEmergencia || '-'}</strong>
                    </div>
                    <div className="col-md-3 mb-2">
                        <small className="text-secondary d-block">Telefone do Contato</small>
                        <strong>{formatTelefone(paciente.TelefoneContatoEmergencia)}</strong>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- MODAL DE EDIÇÃO DE PACIENTE --- */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Paciente</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveEdit}>
          <Modal.Body>
            <h6 className="text-primary mb-3">Dados Pessoais</h6>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Completo</Form.Label>
                  <Form.Control type="text" name="NomeCompleto" required value={editForm.NomeCompleto} onChange={handleEditChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control type="text" name="CPF" required value={editForm.CPF} onChange={handleEditChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Nascimento</Form.Label>
                  <Form.Control type="date" name="DataNascimento" required value={editForm.DataNascimento} onChange={handleEditChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado Civil</Form.Label>
                  <Form.Select name="EstadoCivil" value={editForm.EstadoCivil} onChange={handleEditChange}>
                    <option value="">Selecione...</option>
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <h6 className="text-primary mb-3 mt-2">Contato e Endereço</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control type="text" name="Telefone" value={editForm.Telefone} onChange={handleEditChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="Email" value={editForm.Email} onChange={handleEditChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>Endereço</Form.Label>
                        <Form.Control type="text" name="Endereco" value={editForm.Endereco} onChange={handleEditChange} />
                    </Form.Group>
                </Col>
            </Row>

            <h6 className="text-danger mb-3 mt-2">Contato de Emergência</h6>
            <Row className="p-3 bg-light rounded mx-1">
              <Col md={6}>
                <Form.Group className="mb-0">
                  <Form.Label>Nome do Contato</Form.Label>
                  <Form.Control type="text" name="NomeContatoEmergencia" value={editForm.NomeContatoEmergencia} onChange={handleEditChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-0">
                  <Form.Label>Telefone do Contato</Form.Label>
                  <Form.Control type="text" name="TelefoneContatoEmergencia" value={editForm.TelefoneContatoEmergencia} onChange={handleEditChange} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={editSaving}>
              {editSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* --- MODAL DE EXCLUSÃO DE TESTE --- */}
      <Modal show={showDeleteTestModal} onHide={() => setShowDeleteTestModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este teste? <br/>
          <small className="text-muted">Esta ação não poderá ser desfeita.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteTestModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteTest} disabled={deletingTest}>
            {deletingTest ? 'Excluindo...' : 'Sim, Excluir'}
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}