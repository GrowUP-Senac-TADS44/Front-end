// src/components/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom'; 
import { Sidebar } from '../../components/Sidebar/Sidebar';
import './MainLayout.css'; 

export function MainLayout(): JSX.Element {
  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        {/* O Outlet é o buraco onde o RelatorioPage vai aparecer */}
        <Outlet /> 
      </main>
    </div>
  );
}
