import { Request, Response } from 'express';
import prisma from '../prisma';

// --- FUNÇÕES CRUD PADRÃO (Que já existiam) ---

export async function listProntuarios(_req: Request, res: Response) {
  const items = await prisma.prontuario.findMany();
  res.json(items);
}

export async function getProntuario(req: Request, res: Response) {
  const id = Number(req.params.id);
  const item = await prisma.prontuario.findUnique({ where: { ProntuarioID: id } });
  if (!item) return res.status(404).json({ error: 'Prontuário não encontrado' });
  res.json(item);
}

export async function createProntuario(req: Request, res: Response) {
  try {
    const created = await prisma.prontuario.create({ data: req.body });
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateProntuario(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    const updated = await prisma.prontuario.update({ where: { ProntuarioID: id }, data: req.body });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteProntuario(req: Request, res: Response) {
  const id = Number(req.params.id);
  try {
    await prisma.prontuario.delete({ where: { ProntuarioID: id } });
    res.status(204).end();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

// --- NOVAS FUNÇÕES (Para o Relatório/Rascunho) ---

export async function getProntuarioAtivoDoPaciente(req: Request, res: Response) {
  const pacienteId = Number(req.params.id);

  try {
    // Busca o prontuário mais recente (Ativo)
    const prontuario = await prisma.prontuario.findFirst({
      where: { PacienteID: pacienteId },
      orderBy: { DataAbertura: 'desc' }
    });

    if (!prontuario) {
      return res.status(404).json({ error: 'Nenhum prontuário ativo encontrado.' });
    }

    res.json(prontuario);
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao buscar prontuário.' });
  }
}

export async function saveRascunhoLaudo(req: Request, res: Response) {
  const pacienteId = Number(req.params.id);
  const { texto } = req.body;

  try {
    const prontuario = await prisma.prontuario.findFirst({
      where: { PacienteID: pacienteId },
      orderBy: { DataAbertura: 'desc' }
    });

    if (!prontuario) {
      return res.status(404).json({ error: 'Prontuário não encontrado.' });
    }

    const updated = await prisma.prontuario.update({
      where: { ProntuarioID: prontuario.ProntuarioID },
      data: { ResumoFinal: texto } // Salva no campo ResumoFinal
    });

    res.json({ message: 'Rascunho salvo com sucesso!', data: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Erro ao salvar rascunho.' });
  }
}