// src/pages/PacienteHistorico/PatientEvolutions.tsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';

const mockEvolutions = [
  {
    id: 1,
    date: '22/07/2024',
    time: '10:30',
    doctor: 'Dra. Ana Souza',
    description: 'Paciente relata melhora significativa nos sintomas de ansiedade após início da terapia com novo medicamento. Apresenta bom humor e colaboração durante a consulta.'
  },
  {
    id: 2,
    date: '15/07/2024',
    time: '09:15',
    doctor: 'Dr. Ricardo Mendes',
    description: 'Realizada sessão de fisioterapia respiratória. A paciente tolerou bem o procedimento, sem queixas de desconforto. Saturação manteve-se estável durante todo o atendimento.'
  }
];

export function PatientEvolutions() {
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
        {mockEvolutions.map((evo) => (
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
        ))}
      </div>
    </div>
  );
}