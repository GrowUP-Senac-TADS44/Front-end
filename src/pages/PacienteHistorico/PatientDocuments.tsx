import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import { FaPlus, FaEye, FaDownload, FaTrash } from 'react-icons/fa'; // Adicionei FaTrash
import { useParams } from 'react-router-dom';
import { pacienteService, type Documento } from '../../services/pacienteService';

// Defina a URL base da sua API aqui (ou importe de um arquivo de config)
const API_BASE_URL = 'http://localhost:3000';

export function PatientDocuments() {
  const { id } = useParams();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados para o Modal de Exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadDocuments(Number(id));
    }
  }, [id]);

  const loadDocuments = async (pacienteId: number) => {
    try {
      const data = await pacienteService.getDocumentos(pacienteId);
      setDocumentos(data);
    } catch (err) {
      setError('Erro ao carregar documentos.');
    } finally {
      setLoading(false);
    }
  };

  // Função para abrir o modal de confirmação
  const confirmDelete = (docId: number) => {
    setDocToDelete(docId);
    setShowDeleteModal(true);
  };

  // Função que realmente apaga
  const handleDelete = async () => {
    if (!docToDelete) return;
    setDeleting(true);
    try {
      await pacienteService.deleteDocumento(docToDelete);
      
      // Remove da lista visualmente sem precisar recarregar tudo
      setDocumentos(documentos.filter(d => d.id !== docToDelete));
      setShowDeleteModal(false);
    } catch (err) {
      alert('Erro ao excluir documento.');
    } finally {
      setDeleting(false);
      setDocToDelete(null);
    }
  };

  // Função auxiliar para badge de extensão
  const getExtensionBadge = (filePath: string) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    
    if (ext === 'pdf') return <Badge bg="danger" className="bg-opacity-10 text-danger px-3 py-2 fw-normal">PDF</Badge>;
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') return <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-2 fw-normal">IMG</Badge>;
    
    return <Badge bg="secondary" className="px-3 py-2 fw-normal">{ext?.toUpperCase() || 'DOC'}</Badge>;
  };

  if (loading) return <div className="text-center p-4"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="history-title mb-0">Documentos Anexados</h3>
        <Button variant="primary" className="d-flex align-items-center gap-2">
          <FaPlus size={12} />
          Upload Documento
        </Button>
      </div>

      <div className="table-card">
        <Table hover responsive className="pacientes-table align-middle">
          <thead>
            <tr>
              <th style={{width: '40%'}}>Nome / Descrição</th>
              <th style={{width: '20%'}}>Categoria</th>
              <th style={{width: '20%'}}>Data de Emissão</th>
              <th style={{width: '10%'}}>Arquivo</th>
              <th style={{width: '10%'}} className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {documentos.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-4 text-muted">Nenhum documento encontrado.</td></tr>
            ) : (
              documentos.map((doc) => (
                <tr key={doc.id}>
                  <td className="fw-medium text-dark py-3">{doc.name}</td>
                  <td className="text-secondary">{doc.type}</td>
                  <td className="text-secondary">{doc.date}</td>
                  <td>{getExtensionBadge(doc.filePath)}</td>
                  <td className="text-end">
                    <div className="d-flex gap-3 justify-content-end text-secondary align-items-center">
                      <FaEye style={{cursor: 'pointer'}} title="Visualizar" />
                      
                      <a 
                        href={`${API_BASE_URL}${doc.filePath}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        download
                        title="Baixar"
                        className="text-secondary d-flex align-items-center"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <FaDownload />
                      </a>

                      {/* BOTÃO DE EXCLUIR */}
                      <FaTrash 
                        style={{cursor: 'pointer', color: '#d93025'}} 
                        title="Excluir"
                        onClick={() => confirmDelete(doc.id)}
                      />

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* --- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO --- */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja excluir este documento? <br/>
          <small className="text-muted">Esta ação não poderá ser desfeita.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Excluindo...' : 'Sim, Excluir'}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}