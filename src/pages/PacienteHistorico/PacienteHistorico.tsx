// src/pages/PacienteHistorico/PacienteHistorico.tsx

import React, { useState } from 'react';
import { Container, Button, Table, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlus as Plus } from "react-icons/fa";
import './PacienteHistorico.css';

import { PatientEvolutions } from './PatientEvolutions';
import { PatientDocuments } from './PatientDocuments';

// Dados Mockados da Maria
const mockTestsData = [
  { id: 1, date: '15/02/2022', type: 'Hemograma completo', doctor: 'Dr. Ana Souza', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', link: '#' },
  { id: 2, date: '15/06/2024', type: 'Tomografia computadorizada', doctor: 'Dr. Lúcia Martins', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', link: '#' },
  { id: 3, date: '15/02/2022', type: 'Hemograma completo', doctor: 'Dr. Ana Souza', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', link: '#' },
  { id: 4, date: '15/06/2024', type: 'Tomografia computadorizada', doctor: 'Dr. Lúcia Martins', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', link: '#' },
];

export default function PatientHistory() {
  //   aba 'evolucoes' 
  const [activeTab, setActiveTab] = useState('evolucoes');

  const renderTestesContent = () => (
    <div className="history-table-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="history-title mb-0">Histórico de teste aplicados</h3>
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
            <th>Profissional responsável</th>
            <th>Resultado | Laudo</th>
          </tr>
        </thead>
        <tbody>
          {mockTestsData.map((item, index) => (
            <tr key={`${item.id}-${index}`}>
              <td><Form.Check type="checkbox" /></td>
              <td>{item.date}</td>
              <td>{item.type}</td>
              <td>
                <div className="professional-cell">
                  <img src={item.avatar} alt={item.doctor} className="pro-avatar" />
                  {item.doctor}
                </div>
              </td>
              <td><a href={item.link} className="link-laudo">Link</a></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <Container fluid className="p-4">
      <Link to="/pacientes" className="back-link">
        Pacientes
      </Link>

      {/* --- HEADER DO PACIENTE: MARIA SOUZA --- */}
      <div className="patient-header">
        <div className="patient-info">
          <img 
            src="https://randomuser.me/api/portraits/women/65.jpg" // Foto feminina
            alt="Maria Souza" 
            className="patient-avatar" 
          />
          <div className="patient-details">
            <h2 className="fw-bold">Maria Souza</h2>
            <div className="text-secondary">
                <span>Paciente</span> <br/>
                {/* ID fictício  */}
                <span>Paciente ID: 987654321</span> 
            </div>
          </div>
        </div>
      </div>

      {/* --- NAVEGAÇÃO DAS ABAS --- */}
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
        
        <div 
          className={`tab-item ${activeTab === 'dados' ? 'active' : ''}`}
          onClick={() => setActiveTab('dados')}
        >
          Dados Cadastrais
        </div>
      </div>

      {/* --- CONTEÚDO DINÂMICO --- */}
      <div className="mt-4">
        {activeTab === 'evolucoes' && <PatientEvolutions />}
        {activeTab === 'testes' && renderTestesContent()}
        {activeTab === 'documentos' && <PatientDocuments />}
        {activeTab === 'dados' && <div className="p-4 text-muted bg-white rounded shadow-sm">Dados cadastrais em construção...</div>}
      </div>

    </Container>
  );
}