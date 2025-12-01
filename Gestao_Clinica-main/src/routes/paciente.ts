import express from 'express';
import {
  listPacientes,
  getPaciente,
  createPaciente,
  updatePaciente,
  deletePaciente,
} from '../controllers/pacienteController';
import { listDocumentosDoPaciente } from '../controllers/documentoController';
import { listEvolucoesDoPaciente } from '../controllers/consultaController';

const router = express.Router();

// --- ROTAS ESPECÍFICAS (Sub-recursos) ---
router.get('/:id/evolucoes', listEvolucoesDoPaciente); 
router.get('/:id/documentos', listDocumentosDoPaciente);

// --- ROTAS CRUD GENÉRICAS ---
router.get('/', listPacientes);
router.get('/:id', getPaciente);
router.post('/', createPaciente);
router.put('/:id', updatePaciente);
router.delete('/:id', deletePaciente);

export default router;