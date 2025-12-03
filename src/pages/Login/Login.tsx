// src/pages/Login/Login.tsx
import React, { useState } from 'react'; // Adicionado useState
import { Button, Card, Col, Container, Form, FormControl, FormLabel, Image, Row, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logoSgv from "../../assets/logo.svg";
import { authService } from '../../services/authService'; // Importar o serviço
import "./Login.css";

export function Login() {
  const navigate = useNavigate();
  
  // 1. Estados para capturar os dados dos inputs
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  // Estados para feedback visual
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);

    try {
      await authService.login(email, senha);
      navigate("/dashboard"); // Vai para a lista de pacientes
    } catch (err: any) {
      console.error("Erro completo:", err); // Para ver no F12

      // --- BLINDAGEM CONTRA O ERRO #31 ---
      let msg = 'Falha ao realizar login.';

      if (err.response) {
        // O servidor respondeu, mas com erro (404, 401, 500)
        const errorData = err.response.data;
        
        if (typeof errorData === 'string') {
            // Se o servidor mandou HTML (ex: "Cannot POST..."), usa isso
            msg = errorData;
        } else if (errorData?.error) {
            // Se mandou JSON { error: ... }
            if (typeof errorData.error === 'string') {
                msg = errorData.error;
            } else {
                // Se o 'error' for um objeto, converte para texto para não quebrar
                msg = JSON.stringify(errorData.error);
            }
        }
      } else if (err.message) {
        // Erro de conexão (sem internet, servidor fora)
        msg = err.message;
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Row>
        <Col>
          <Card className="card-login-style">
            <Card.Title className="d-flex align-items-center justify-content-center">
              <Image src={logoSgv} fluid />
            </Card.Title>
            <Card.Body className="mt-5">
              <h4 className="mb-4">Acesse sua conta</h4>
              
              {/* Exibe erro se houver */}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleLogin}>
                <Row className="mb-4">
                  <Col>
                    <FormLabel>Email</FormLabel>
                    <FormControl 
                      type="email" 
                      placeholder="exemplo@email.com"
                      required
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} // Atualiza o estado
                    />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <FormLabel>Senha</FormLabel>
                    <FormControl 
                      type="password" 
                      placeholder="...."
                      required
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)} // Atualiza o estado
                    />
                  </Col>
                </Row>
                
                <Link to="/recuperar-senha">Esqueceu a senha?</Link>
                
                <Row>
                  <Col md={10} className="d-flex justify-content-end">
                    <Button 
                      className="px-5" 
                      as="button" // Mudado para button para suportar disabled
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : "Entrar"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
