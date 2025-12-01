import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import pacienteRouter from './routes/paciente';
import medicoRouter from './routes/medico';
import prontuarioRouter from './routes/prontuario';
import consultaRouter from './routes/consulta';
import diagnosticoRouter from './routes/diagnostico';
import testeRouter from './routes/testeAplicado';
import documentoRouter from './routes/documento';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));

app.use('/pacientes', pacienteRouter);
app.use('/medicos', medicoRouter);
app.use('/prontuarios', prontuarioRouter);
app.use('/consultas', consultaRouter);
app.use('/auth', authRouter);
app.use('/diagnosticos', diagnosticoRouter);
app.use('/testes', testeRouter);
app.use('/documentos', documentoRouter);

// tratamento de erro simples
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
