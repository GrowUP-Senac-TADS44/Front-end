import React, { useEffect, useState } from 'react';
import { Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaPlus, FaEye, FaDownload } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { pacienteService, type Documento } from '../../services/pacienteService';

export function PatientDocuments() {
  const { id } = useParams();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Função auxiliar para tentar descobrir a extensão (PDF, JPG) baseada no caminho do arquivo
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
                  <td>{getFileExtension(doc.filePath)}</td>
                  <td className="text-end">
                    <div className="d-flex gap-3 justify-content-end text-secondary">
                      <FaEye style={{cursor: 'pointer'}} title="Visualizar" />
                      <FaDownload style={{cursor: 'pointer'}} title="Baixar" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
  
  // Wrapper para chamar a função de badge corretamente dentro do render
  function getFileExtension(path: string) {
      return getExtensionBadge(path);
  }
}