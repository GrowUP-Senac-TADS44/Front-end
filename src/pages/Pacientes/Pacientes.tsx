import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Table, Spinner, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';
import './Pacientes.css';
import { pacienteService, type Paciente } from '../../services/pacienteService';

export default function Pacientes() {
  
  // Estados de Dados
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Estados do Modal
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estado do Formulário (Agora com TODOS os campos)
  const [formData, setFormData] = useState({
    NomeCompleto: '',
    CPF: '',
    DataNascimento: '',
    Telefone: '',
    Email: '',
    Endereco: '',
    EstadoCivil: '',
    NomeContatoEmergencia: '',
    TelefoneContatoEmergencia: ''
  });

  // Busca dados ao carregar
  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      const data = await pacienteService.getAll();
      setPacientes(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar lista de pacientes.');
    } finally {
      setLoading(false);
    }
  };

  // Funções do Modal
  const handleOpenModal = () => setShowModal(true);
  
  const handleCloseModal = () => {
    setShowModal(false);
    // Limpa o formulário completo ao fechar
    setFormData({ 
      NomeCompleto: '', CPF: '', DataNascimento: '', Telefone: '', Email: '',
      Endereco: '', EstadoCivil: '', NomeContatoEmergencia: '', TelefoneContatoEmergencia: ''
    });
  };

  // Captura o que o usuário digita (funciona para inputs e selects)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Envia para o Banco
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // 1. Limpeza e Formatação
      const cpfLimpo = formData.CPF.replace(/\D/g, ''); 
      const dataFormatada = new Date(formData.DataNascimento).toISOString();

      // 2. Monta o Payload com todos os campos
      const payload = {
          NomeCompleto: formData.NomeCompleto,
          CPF: cpfLimpo,
          DataNascimento: dataFormatada,
          
          // Campos opcionais: envia o valor ou null se estiver vazio
          Telefone: formData.Telefone || null,
          Email: formData.Email || null,
          Endereco: formData.Endereco || null,
          EstadoCivil: formData.EstadoCivil || null,
          NomeContatoEmergencia: formData.NomeContatoEmergencia || null,
          TelefoneContatoEmergencia: formData.TelefoneContatoEmergencia || null
      };

      console.log("Enviando Payload:", payload);

      await pacienteService.create(payload);

      handleCloseModal();
      fetchPacientes();
      alert('Paciente cadastrado com sucesso!');
      
    } catch (err: any) {
      console.error("Erro detalhado:", err); 
      const msg = err.response?.data?.error || 'Erro ao criar paciente. Verifique o console.';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // Filtragem local
  const filteredPacientes = pacientes.filter(p => 
    p.NomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.CPF && p.CPF.includes(searchTerm))
  );

  return (
    <Container fluid className="pacientes-container">
      <h2 className="page-title">Pacientes</h2>

      <div className="toolbar">
        <Row className="align-items-center">
          <Col md={8}>
            <InputGroup className="search-input-group">
              <InputGroup.Text><FaSearch /></InputGroup.Text>
              <Form.Control
                placeholder="Buscar paciente por nome ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={4} className="text-end">
            <Button variant="primary" onClick={handleOpenModal} className="d-inline-flex align-items-center gap-2">
              <FaPlus />
              Adicionar Paciente
            </Button>
          </Col>
        </Row>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="table-card">
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table responsive hover className="pacientes-table">
            <thead>
              <tr>
                <th>PACIENTE</th>
                <th>CPF</th>
                <th>TELEFONE</th>
                <th>DATA NASC.</th> 
                <th className="text-end">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filteredPacientes.length === 0 ? (
                 <tr><td colSpan={5} className="text-center py-4">Nenhum paciente encontrado.</td></tr>
              ) : (
                filteredPacientes.map((patient) => (
                  <tr key={patient.PacienteID}>
                    <td>
                      <div className="patient-profile-cell">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${patient.NomeCompleto}&background=random`} 
                          alt={patient.NomeCompleto} 
                          className="table-avatar"
                        />
                        <span className="patient-name">{patient.NomeCompleto}</span>
                      </div>
                    </td>
                    <td>{patient.CPF || '-'}</td>
                    <td>{patient.Telefone || '-'}</td>
                    <td>
                        {patient.DataNascimento 
                          ? new Date(patient.DataNascimento).toLocaleDateString('pt-BR') 
                          : '-'}
                    </td>
                    <td className="text-end">
                      <Link to={`/pacientes/${patient.PacienteID}`} className="details-link">
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </div>

      {/* --- MODAL DE ADICIONAR PACIENTE --- */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg"> {/* Aumentei para size="lg" */}
        <Modal.Header closeButton>
          <Modal.Title>Novo Paciente</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            
            {/* --- SEÇÃO: DADOS PESSOAIS --- */}
            <h6 className="text-primary mb-3">Dados Pessoais</h6>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Completo *</Form.Label>
                  <Form.Control 
                    type="text" name="NomeCompleto" required
                    value={formData.NomeCompleto} onChange={handleChange}
                    placeholder="Ex: João da Silva"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>CPF *</Form.Label>
                  <Form.Control 
                    type="text" name="CPF" required
                    value={formData.CPF} onChange={handleChange}
                    placeholder="Apenas números"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Nascimento *</Form.Label>
                  <Form.Control 
                    type="date" name="DataNascimento" required
                    value={formData.DataNascimento} onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado Civil</Form.Label>
                  <Form.Select 
                    name="EstadoCivil"
                    value={formData.EstadoCivil} onChange={handleChange}
                  >
                    <option value="">Selecione...</option>
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                    <option value="Outro">Outro</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* --- SEÇÃO: CONTATO --- */}
            <h6 className="text-primary mb-3 mt-2">Contato e Endereço</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefone / Celular</Form.Label>
                  <Form.Control 
                    type="text" name="Telefone"
                    value={formData.Telefone} onChange={handleChange}
                    placeholder="(00) 00000-0000"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" name="Email"
                    value={formData.Email} onChange={handleChange}
                    placeholder="email@exemplo.com"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Endereço Completo</Form.Label>
                  <Form.Control 
                    type="text" name="Endereco"
                    value={formData.Endereco} onChange={handleChange}
                    placeholder="Rua, Número, Bairro, Cidade"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* --- SEÇÃO: EMERGÊNCIA --- */}
            <h6 className="text-danger mb-3 mt-2">Contato de Emergência</h6>
            <Row className="p-3 bg-light rounded mx-1">
              <Col md={6}>
                <Form.Group className="mb-0">
                  <Form.Label>Nome do Contato</Form.Label>
                  <Form.Control 
                    type="text" name="NomeContatoEmergencia"
                    value={formData.NomeContatoEmergencia} onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-0">
                  <Form.Label>Telefone do Contato</Form.Label>
                  <Form.Control 
                    type="text" name="TelefoneContatoEmergencia"
                    value={formData.TelefoneContatoEmergencia} onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Paciente'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </Container>
  );
}