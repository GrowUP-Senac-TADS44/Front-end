import { Outlet } from 'react-router-dom'; 
import { Sidebar } from '../../components/Sidebar/Sidebar';
import './MainLayout.css'; 

export function MainLayout() { // Removido : JSX.Element
  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <Outlet /> 
      </main>
    </div>
  );
}