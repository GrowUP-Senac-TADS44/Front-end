import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Table, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus } from 'react-icons/fa';
import './Pacientes.css';
import { pacienteService, type Paciente } from '../../services/pacienteService';

export default function Pacientes() {
  
  // Estados para dados reais
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Busca dados ao carregar a página
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

  const handleAddPatient = () => {
    alert("Funcionalidade de adicionar paciente será implementada em breve!");
  };

  // Filtragem local (Front-end search)
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
            <Button variant="primary" onClick={handleAddPatient} className="d-inline-flex align-items-center gap-2">
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
                        {/* Avatar Gerado Aleatoriamente baseado no ID para manter visual */}
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
                      {/* ROTA DINÂMICA: Passamos o ID na URL */}
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
    </Container>
  );
}