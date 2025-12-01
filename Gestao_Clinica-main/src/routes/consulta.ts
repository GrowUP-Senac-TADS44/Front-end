import express from 'express';
import {
  listConsultas,
  getConsulta,
  createConsulta,
  updateConsulta,
  deleteConsulta,
  getPacientesHoje,
} from '../controllers/consultaController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', listConsultas);
router.get('/:id', getConsulta);
router.post('/', createConsulta);
router.put('/:id', updateConsulta);
router.delete('/:id', deleteConsulta);


router.get('/medico/:medicoId/pacientes-hoje', authMiddleware, getPacientesHoje);

// src/controllers/consultaController.ts
import { Request, Response } from 'express';
import prisma from '../prisma';

export async function listEvolucoesDoPaciente(req: Request, res: Response) {
  const pacienteId = Number(req.params.id);

  try {
    const consultas = await prisma.consulta.findMany({
      where: {
        // Busca consultas onde o Prontuário pertence a este Paciente
        prontuario: {
          PacienteID: pacienteId
        }
      },
      include: {
        medico: true, // Para pegar o nome do médico
      },
      orderBy: {
        DataHoraInicio: 'desc' // As mais recentes primeiro
      }
    });

    // Formata para o padrão que o Front-end espera
    const evolucoes = consultas.map(c => {
      const dataObj = new Date(c.DataHoraInicio);
      
      return {
        id: c.ConsultaID,
        // Formatação simples de data (DD/MM/AAAA)
        date: dataObj.toLocaleDateString('pt-BR'),
        // Formatação simples de hora (HH:MM)
        time: dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        doctor: c.medico.NomeCompleto,
        description: c.ResumoConsulta || c.Observacoes || "Sem descrição."
      };
    });

    res.json(evolucoes);

  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar evoluções.' });
  }
}

export default router;
