// src/components/sidebar/Sidebar.tsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Adicionado useNavigate
import { MdDashboard, MdAccountCircle, MdLogout } from 'react-icons/md'; // Adicionado ícone MdLogout
import { FaUserFriends } from 'react-icons/fa';
import { TbReport } from 'react-icons/tb';

import './Sidebar.css'; 

export function Sidebar(): JSX.Element {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aqui você pode limpar tokens de autenticação, localStorage, etc.
    // Exemplo: localStorage.removeItem('userToken');
    
    // Redireciona para a tela de login
    navigate('/');
  };

  return (
    <nav className="sp-sidebar">
      <div className="sp-sidebar-logo">
        SAÚDE POSITIVA
      </div>
      
      <ul className="sp-sidebar-nav">
        <li>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => (isActive ? 'active' : '')}
          > 
            <MdDashboard />
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/pacientes"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <FaUserFriends />
            <span>Pacientes</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/relatorios"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <TbReport />
            <span>Relatórios</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/conta"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <MdAccountCircle />
            <span>Conta</span>
          </NavLink>
        </li>
      </ul>

      {/* Botão de Logout no final */}
      <div className="sp-sidebar-logout">
        <button onClick={handleLogout} className="sp-logout-btn">
          <MdLogout />
          <span>Sair</span>
        </button>
      </div>
    </nav>
  );
}