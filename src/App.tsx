import { Route, Routes } from 'react-router-dom'
import { Login } from './Pages/Login/Login';
import { EmailAccessRecover } from './Pages/EmailAccessRecover/EmailAccessRecover';
import { EmailSend } from './Pages/EmailSend/EmailSend';
import { NewPassword } from './Pages/NewPassword/NewPassword';

export function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/EmailAccessRecover" element={<EmailAccessRecover />} />
      <Route path="/EmailSend" element={<EmailSend />} />
      <Route path="/NewPassword" element={<NewPassword />} />
    </Routes>
  );
}
