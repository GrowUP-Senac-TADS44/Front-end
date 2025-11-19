// src/pages/Pacientes/Pacientes.tsx

import React from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa'; // Usando react-icons
import './Pacientes.css';



const mockPatients = [
  {
    id: 1,
    name: 'Maria Souza',
    cpf: '987.654.321-00',
    phone: '(21) 91234-5678',
    lastVisit: '12/07/2024',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg' // Foto feminina
  },
  {
    id: 2,
    name: 'Carlos Silva',
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    lastVisit: '15/07/2024',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg' // Foto masculina
  },
  
  {
    id: 3,
    name: 'João Pereira',
    cpf: '456.789.123-00',
    phone: '(31) 95555-4444',
    lastVisit: '10/07/2024',
    avatar: 'https://randomuser.me/api/portraits/men/85.jpg'
  },
  {
    id: 4,
    name: 'Ana Costa',
    cpf: '321.654.987-00',
    phone: '(41) 98888-7777',
    lastVisit: '05/07/2024',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
  }
];

export default function Pacientes() {
  const navigate = useNavigate();

  const handleAddPatient = () => {
    alert("Funcionalidade de adicionar paciente será implementada em breve!");
  };

  return (
    <Container fluid className="pacientes-container">
      <h2 className="page-title">Pacientes</h2>

      {/* Barra de Ferramentas */}
      <div className="toolbar">
        <Row className="align-items-center">
          <Col md={8}>
            <InputGroup className="search-input-group">
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Buscar paciente por nome ou CPF..."
                aria-label="Buscar paciente"
              />
            </InputGroup>
          </Col>
          <Col md={4} className="text-end">
            <Button variant="primary" onClick={handleAddPatient} className="d-inline-flex align-items-center gap-2">
              <FaPlus />
              Adicionar Paciente
            </Button>
          </Col>
        </Row>
      </div>

      {/* Tabela */}
      <div className="table-card">
        <Table responsive hover className="pacientes-table">
          <thead>
            <tr>
              <th>PACIENTE</th>
              <th>CPF</th>
              <th>TELEFONE</th>
              <th>ÚLTIMA CONSULTA</th>
              <th className="text-end">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {mockPatients.map((patient) => (
              <tr key={patient.id}>
                <td>
                  <div className="patient-profile-cell">
                    <img 
                      src={patient.avatar} 
                      alt={patient.name} 
                      className="table-avatar"
                    />
                    <span className="patient-name">{patient.name}</span>
                  </div>
                </td>
                <td>{patient.cpf}</td>
                <td>{patient.phone}</td>
                <td>{patient.lastVisit}</td>
                <td className="text-end">
                  {/* Link para a tela de histórico que criamos anteriormente */}
                  <Link to="/pacientes/historico" className="details-link">
                    Ver detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}