import { Request, Response } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

  try {
    const rows: any = await prisma.$queryRaw`SELECT * FROM \`Médico\` WHERE Email = ${email} LIMIT 1`;
    const medico = Array.isArray(rows) ? rows[0] : rows;
    if (!medico) return res.status(401).json({ error: 'Credenciais inválidas' });

    const storedPassword = medico.Senha || medico.senha || medico.Password || medico.password;
    if (!storedPassword) return res.status(500).json({ error: 'Senha não encontrada para o usuário' });

    let passwordMatch = false;
    if (typeof storedPassword === 'string' && (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$'))) {
      passwordMatch = await bcrypt.compare(senha, storedPassword);
    } else {
      passwordMatch = senha === storedPassword;
    }

    if (!passwordMatch) return res.status(401).json({ error: 'Credenciais inválidas' });

    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ medicoId: medico.MedicoID, email: medico.Email }, secret, { expiresIn: '8h' });

    const { Senha, senha: s, Password, password, ...medicoSemSenha } = medico;

    res.json({ token, medico: medicoSemSenha });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
