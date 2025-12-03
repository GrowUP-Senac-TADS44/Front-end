import { NavLink, useNavigate } from 'react-router-dom';
import { MdDashboard, MdAccountCircle, MdLogout } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';
// TbReport removido pois não estava sendo usado

import './Sidebar.css'; 

export function Sidebar() { // Removido : JSX.Element
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('medico');
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
            to="/conta"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <MdAccountCircle />
            <span>Conta</span>
          </NavLink>
        </li>
      </ul>

      <div className="sp-sidebar-logout">
        <button onClick={handleLogout} className="sp-logout-btn">
          <MdLogout />
          <span>Sair</span>
        </button>
      </div>
    </nav>
  );
}