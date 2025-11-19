// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- ÁREA PÚBLICA ---
import { Login } from './pages/Login/Login';
import { EmailAccessRecover } from './pages/EmailAccessRecover/EmailAccessRecover'; 
import { EmailSend } from './pages/EmailSend/EmailSend';
import { NewPassword } from './pages/NewPassword/NewPassword';

// --- ÁREA PRIVADA ---
import { MainLayout } from './pages/MainLayout/MainLayout';
import RelatorioPage from './pages/RelatorioPage/RelatorioPage';
import PatientHistory from './pages/PacienteHistorico/PacienteHistorico';
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
        <Route path="/relatorios" element={<RelatorioPage />} />
        
        {/* Nova Rota de Histórico de Pacientes */}
        <Route path="/pacientes/historico" element={<PatientHistory />} />
        <Route path="/pacientes" element={<Pacientes />} />        
        <Route path="/dashboard" element={<div style={{padding: 20}}>Dashboard (Em construção)</div>} />
      </Route>
    </Routes>
  );
}