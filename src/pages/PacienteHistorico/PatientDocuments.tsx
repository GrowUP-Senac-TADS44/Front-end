// src/pages/PacienteHistorico/PatientDocuments.tsx
import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { FaPlus, FaEye, FaDownload } from 'react-icons/fa';

const mockDocuments = [
  { id: 1, name: 'Exame de Sangue - Jul/2024', date: '23/07/2024', type: 'PDF' },
  { id: 2, name: 'Relatório de Internação - 2023', date: '15/12/2023', type: 'PDF' },
  { id: 3, name: 'Tomografia Computadorizada', date: '05/11/2023', type: 'JPG' },
  { id: 4, name: 'Consentimento Informado', date: '01/07/2023', type: 'PDF' },
];

export function PatientDocuments() {
  
  const getTypeBadge = (type: string) => {
    if (type === 'PDF') return <Badge bg="danger" className="bg-opacity-10 text-danger px-3 py-2 fw-normal">PDF</Badge>;
    if (type === 'JPG') return <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-2 fw-normal">JPG</Badge>;
    return <Badge bg="secondary">{type}</Badge>;
  };

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
              <th style={{width: '40%'}}>Nome do Documento</th>
              <th style={{width: '30%'}}>Data de Upload</th>
              <th style={{width: '15%'}}>Tipo</th>
              <th style={{width: '15%'}} className="text-end"></th>
            </tr>
          </thead>
          <tbody>
            {mockDocuments.map((doc) => (
              <tr key={doc.id}>
                <td className="fw-medium text-dark py-3">{doc.name}</td>
                <td className="text-secondary">{doc.date}</td>
                <td>{getTypeBadge(doc.type)}</td>
                <td className="text-end">
                  <div className="d-flex gap-3 justify-content-end text-secondary">
                    <FaEye style={{cursor: 'pointer'}} title="Visualizar" />
                    <FaDownload style={{cursor: 'pointer'}} title="Baixar" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}