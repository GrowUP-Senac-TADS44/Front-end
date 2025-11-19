// src/pages/Login/Login.tsx
import React from 'react';
import { Button, Card, Col, Container, Form, FormControl, FormLabel, Image, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"; // Importamos Link e useNavigate
import logoSgv from "../../assets/logo.svg";
import "./Login.css";

export function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você adicionará a lógica real de autenticação no futuro.
    // Por enquanto, redirecionamos direto para o sistema:
    navigate("/relatorios");
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
              {/* Adicionamos o onSubmit */}
              <Form onSubmit={handleLogin}>
                <Row className="mb-4">
                  <Col>
                    <FormLabel>Email</FormLabel>
                    <FormControl type="email" placeholder="exemplo@email.com" />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <FormLabel>Senha</FormLabel>
                    <FormControl type="password" placeholder="...." />
                  </Col>
                </Row>
                
                {/* Link SPA: Navega sem recarregar */}
                <Link to="/recuperar-senha">Esqueceu a senha?</Link>
                
                <Row>
                  <Col md={10} className="d-flex justify-content-end">
                    <Button className="px-5" as="input" type="submit" value={"Entrar"} />
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