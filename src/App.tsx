import { Route, Routes } from 'react-router-dom'
import { Login } from './Pages/Login/Login';

export function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}
