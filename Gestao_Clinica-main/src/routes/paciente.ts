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
import { getProntuarioAtivoDoPaciente, saveRascunhoLaudo } from '../controllers/prontuarioController'; // <--- Importe aqui

const router = express.Router();

// Rotas Específicas
router.get('/:id/evolucoes', listEvolucoesDoPaciente); 
router.get('/:id/documentos', listDocumentosDoPaciente);

// --- NOVAS ROTAS DO LAUDO ---
router.get('/:id/prontuario-ativo', getProntuarioAtivoDoPaciente);
router.put('/:id/laudo', saveRascunhoLaudo);
// ----------------------------

// Rotas CRUD
router.get('/', listPacientes);
router.get('/:id', getPaciente);
router.post('/', createPaciente);
router.put('/:id', updatePaciente);
router.delete('/:id', deletePaciente);

export default router;