import React, { useEffect, useState } from 'react';
import { Card, Button, Spinner, Alert, Modal, Form, Row, Col, Dropdown } from 'react-bootstrap';
import { FaPlus, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { pacienteService, type Evolucao } from '../../services/pacienteService';

// Interface do Formulário
interface EvolucaoForm {
  data: string; // YYYY-MM-DD
  hora: string; // HH:MM
  descricao: string;
}

// --- COMPONENTE PERSONALIZADO (REMOVE A SETINHA) ---
const CustomToggle = React.forwardRef<HTMLAnchorElement, { children: React.ReactNode; onClick: (e: React.MouseEvent) => void }>(
  ({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="text-secondary p-2 d-flex align-items-center" // Ajuste visual
      style={{ textDecoration: 'none', cursor: 'pointer' }}
    >
      {children}
    </a>
  )
);

export function PatientEvolutions() {
  const { id } = useParams();
  const [evolucoes, setEvolucoes] = useState<Evolucao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados dos Modais
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Estado de Edição (se null, é criação)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Estado do Formulário
  const [formData, setFormData] = useState<EvolucaoForm>({
    data: '',
    hora: '',
    descricao: ''
  });

  useEffect(() => {
    if (id) loadEvolucoes(Number(id));
  }, [id]);

  const loadEvolucoes = async (pacienteId: number) => {
    try {
      const data = await pacienteService.getEvolucoes(pacienteId);
      setEvolucoes(data);
    } catch (err) {
      setError('Não foi possível carregar as evoluções.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (evolucao?: Evolucao) => {
    if (evolucao) {
      const [dia, mes, ano] = evolucao.date.split('/');
      setEditingId(evolucao.id);
      setFormData({
        data: `${ano}-${mes}-${dia}`,
        hora: evolucao.time,
        descricao: evolucao.description
      });
    } else {
      const agora = new Date();
      setEditingId(null);
      setFormData({
        data: agora.toISOString().split('T')[0],
        hora: agora.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        descricao: ''
      });
    }
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);

    try {
      const prontuario = await pacienteService.getProntuarioAtivo(Number(id));
      if (!prontuario) throw new Error("Prontuário não encontrado");

      const medicoStorage = localStorage.getItem('medico');
      const medicoId = medicoStorage ? JSON.parse(medicoStorage).MedicoID : 1;

      const dataHoraIso = new Date(`${formData.data}T${formData.hora}:00`).toISOString();

      const payload = {
        ProntuarioID: prontuario.ProntuarioID,
        MedicoID: medicoId,
        DataHoraInicio: dataHoraIso,
        ResumoConsulta: formData.descricao,
        Observacoes: '',
        StatusConsulta: 'Realizada'
      };

      if (editingId) {
        await pacienteService.updateEvolucao(editingId, payload);
      } else {
        await pacienteService.createEvolucao(payload);
      }

      setShowModal(false);
      loadEvolucoes(Number(id)); 
    } catch (err) {
      alert('Erro ao salvar evolução.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = (evoId: number) => {
    setDeletingId(evoId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deletingId || !id) return;
    try {
      await pacienteService.deleteEvolucao(deletingId);
      setShowDeleteModal(false);
      loadEvolucoes(Number(id));
    } catch (err) {
      alert('Erro ao excluir evolução.');
    }
  };

  if (loading) return <div className="text-center p-3"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="history-title mb-0">Histórico de Evoluções</h3>
        <Button variant="primary" onClick={() => handleOpenModal()} className="d-flex align-items-center gap-2">
          <FaPlus size={12} />
          Nova Evolução
        </Button>
      </div>

      <div className="d-flex flex-column gap-3">
        {evolucoes.length === 0 ? (
           <p className="text-muted text-center">Nenhuma evolução registrada.</p>
        ) : (
          evolucoes.map((evo) => (
            <Card key={evo.id} className="border-0 shadow-sm" style={{borderRadius: '12px'}}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div style={{flex: 1}}>
                    <div className="text-muted mb-2" style={{fontSize: '0.9rem'}}>
                      Data: <strong>{evo.date}</strong> <span className="mx-2">Hora: <strong>{evo.time}</strong></span>
                    </div>
                    <h5 className="fw-bold mb-2">{evo.doctor}</h5>
                    <p className="text-secondary mb-0" style={{lineHeight: '1.6', whiteSpace: 'pre-wrap'}}>
                      {evo.description}
                    </p>
                  </div>

                  {/* MENU DROPDOWN CORRIGIDO (SEM SETA) */}
                  <Dropdown align="end">
                    <Dropdown.Toggle as={CustomToggle} id={`dropdown-${evo.id}`}>
                      <FaEllipsisV />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleOpenModal(evo)}>
                        <FaEdit className="me-2 text-primary" /> Editar
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleConfirmDelete(evo.id)} className="text-danger">
                        <FaTrash className="me-2" /> Excluir
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Editar Evolução' : 'Nova Evolução'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Data</Form.Label>
                  <Form.Control 
                    type="date" name="data" required 
                    value={formData.data} onChange={handleChange} 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Hora</Form.Label>
                  <Form.Control 
                    type="time" name="hora" required 
                    value={formData.hora} onChange={handleChange} 
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Descrição da Evolução</Form.Label>
              <Form.Control 
                as="textarea" rows={5} name="descricao" required 
                value={formData.descricao} onChange={handleChange}
                placeholder="Descreva o atendimento, queixas e condutas..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Evolução'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja apagar este registro de evolução?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Sim, Excluir</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}