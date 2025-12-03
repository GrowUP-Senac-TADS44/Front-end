// src/App.tsx
import { Routes, Route } from 'react-router-dom';

// --- ÁREA PÚBLICA ---
import { Login } from './pages/Login/Login';
import { EmailAccessRecover } from './pages/EmailAccessRecover/EmailAccessRecover'; 
import { EmailSend } from './pages/EmailSend/EmailSend';
import { NewPassword } from './pages/NewPassword/NewPassword';

// --- ÁREA PRIVADA ---
import { MainLayout } from './pages/MainLayout/MainLayout';
import RelatorioPage from './pages/RelatorioPage/RelatorioPage'; // (Opcional se não usar rota direta)
import Dashboard from './pages/Dashboard/Dashboard';
import Conta from './pages/Conta/Conta';
import PatientHistory from './pages/PacienteHistorico/PacienteHistorico'; // <--- IMPORTANTE: Importe isso
import Pacientes from './pages/Pacientes/Pacientes';

export function App() {
  return (
    <Routes>
      {/* === ÁREA PÚBLICA === */}
      <Route path="/" element={<Login />} />
      <Route path="/recuperar-senha" element={<EmailAccessRecover />} />
      <Route path="/email-enviado" element={<EmailSend />} />
      <Route path="/nova-senha" element={<NewPassword />} />

      {/* === ÁREA PRIVADA === */}
      <Route element={<MainLayout />}>
        {/* Rota da Lista de Pacientes */}
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/pacientes/:id" element={<PatientHistory />} />
        
        {/* Outras rotas */}
        <Route path="/relatorios" element={<RelatorioPage />} /> {/* Opcional, pode remover se quiser */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/conta" element={<Conta />} />
      </Route>
    </Routes>
  );
}