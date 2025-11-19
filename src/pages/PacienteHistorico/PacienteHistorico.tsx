// src/pages/PacienteHistorico/PacienteHistorico.tsx

import React from 'react';
import { Container, Row, Col, Button, Table, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus as Plus } from "react-icons/fa";
import './PacienteHistorico.css';

// Dados Mockados para simular a tabela da imagem
const mockHistoryData = [
  { id: 1, date: '15/02/2022', type: 'Hemograma completo', doctor: 'Dr. Ana Souza', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', link: '#' },
  { id: 2, date: '15/06/2024', type: 'Tomografia computadorizada', doctor: 'Dr. Lúcia Martins', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', link: '#' },
  { id: 3, date: '15/02/2022', type: 'Hemograma completo', doctor: 'Dr. Ana Souza', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', link: '#' },
  { id: 4, date: '15/06/2024', type: 'Tomografia computadorizada', doctor: 'Dr. Lúcia Martins', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', link: '#' },
  { id: 5, date: '15/06/2024', type: 'Tomografia computadorizada', doctor: 'Dr. Lúcia Martins', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', link: '#' },
];

export default function PatientHistory() {
  return (
    <Container fluid className="p-4">
      {/* Link de Voltar */}
      <Link to="/pacientes" className="back-link">
        Pacientes
      </Link>

      {/* Cabeçalho do Paciente */}
      <div className="patient-header">
        <div className="patient-info">
          <img 
            src="https://randomuser.me/api/portraits/women/65.jpg" 
            alt="Maria Souza" 
            className="patient-avatar" 
          />
          <div className="patient-details">
            <h2>Maria Souza</h2>
            <span>Paciente</span>
          </div>
        </div>
        
        <div>
          <Button variant="primary" className="d-flex align-items-center gap-2">
            <div className="rounded-circle border border-white p-0 d-flex align-items-center justify-content-center" style={{width: 20, height: 20}}>
                <Plus size={20} />
            </div>
            Novo teste
          </Button>
        </div>
      </div>

      {/* Abas de Navegação */}
      <div className="patient-tabs">
        <div className="tab-item">Evoluções</div>
        <div className="tab-item active">Testes e Laudos</div>
        <div className="tab-item">Documentos</div>
        <div className="tab-item">Dados cadastrais</div>
      </div>

      {/* Conteúdo Principal: Histórico */}
      <div className="history-table-container">
        <h3 className="history-title">Histórico de teste aplicados</h3>

        <Table hover responsive borderless className="table-custom">
          <thead>
            <tr>
              <th style={{width: '50px'}}>
                <Form.Check type="checkbox" />
              </th>
              <th>Data</th>
              <th>Tipo de teste</th>
              <th>Profissional responsável</th>
              <th>Resultado | Laudo</th>
            </tr>
          </thead>
          <tbody>
            {mockHistoryData.map((item, index) => (
              <tr key={`${item.id}-${index}`}> {/* Index usado na key pois repeti dados mockados */}
                <td>
                  <Form.Check type="checkbox" />
                </td>
                <td>{item.date}</td>
                <td>{item.type}</td>
                <td>
                  <div className="professional-cell">
                    <img src={item.avatar} alt={item.doctor} className="pro-avatar" />
                    {item.doctor}
                  </div>
                </td>
                <td>
                  <a href={item.link} className="link-laudo">Link</a>
                </td>
              </tr>
            ))}
            {/* Repetindo para encher a tabela como na imagem */}
            {mockHistoryData.map((item, index) => (
              <tr key={`repeat-${item.id}-${index}`}>
                <td>
                  <Form.Check type="checkbox" />
                </td>
                <td>{item.date}</td>
                <td>{item.type}</td>
                <td>
                  <div className="professional-cell">
                    <img src={item.avatar} alt={item.doctor} className="pro-avatar" />
                    {item.doctor}
                  </div>
                </td>
                <td>
                  <a href={item.link} className="link-laudo">Link</a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}