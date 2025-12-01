// src/pages/PacienteHistorico/PatientEvolutions.tsx
import React, { useEffect, useState } from 'react';
import { Card, Button, Spinner, Alert } from 'react-bootstrap'; // Adicione Spinner/Alert
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { pacienteService } from '../../services/pacienteService';
import type { Evolucao } from '../../services/pacienteService';

export function PatientEvolutions() {
  const { id } = useParams(); // Pega o ID do paciente da URL
  const [evolucoes, setEvolucoes] = useState<Evolucao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadEvolucoes(Number(id));
    }
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

  if (loading) return <div className="text-center p-3"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="history-title mb-0">Histórico de Evoluções e Anotações</h3>
        <Button variant="primary" className="d-flex align-items-center gap-2">
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
                  <div>
                    <div className="text-muted mb-2" style={{fontSize: '0.9rem'}}>
                      Data: <strong>{evo.date}</strong> <span className="mx-2">Hora: <strong>{evo.time}</strong></span>
                    </div>
                    <h5 className="fw-bold mb-3">{evo.doctor}</h5>
                    <p className="text-secondary mb-0" style={{lineHeight: '1.6'}}>
                      {evo.description}
                    </p>
                  </div>
                  <button className="btn btn-link text-secondary p-0">
                    <FaEllipsisV />
                  </button>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}