// src/pages/Emailsend/Emailsend.tsx
import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import { Link } from "react-router-dom"; // Importar Link
import logoSgv from "../../assets/logo.svg";
import "./EmailSend.css";
import { CheckCircleIcon } from "@phosphor-icons/react";

export function EmailSend() {
  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Row>
        <Col>
          <Card className="card-email-send-style">
            <Card.Title className="d-flex align-items-center justify-content-center">
              <Image src={logoSgv} fluid />
            </Card.Title>
            <Card.Body className="mt-5">
              <Row className="d-flex align-items-center justify-content-center">
                <Col md={9}>
                  <div className="mb-4 w-100 d-flex align-items-center">
                    <h4 className="m-0 me-3">E-mail enviado</h4>
                    <CheckCircleIcon className="mt-1" size={25} color="#28a745" />
                  </div>
                  <p className="text-secondary">
                    Verifique sua caixa de entrada. O link expirará.
                  </p>
                  {/* Link simples para simular reenvio */}
                  <button style={{background:'none', border:'none', color:'#007bff', padding:0, cursor:'pointer'}}>Reenviar email</button>
                </Col>
              </Row>
              <Row className="mt-5 d-flex align-items-center justify-content-end">
                <Col md={6}> {/* Aumentei um pouco o Col para caber o botão */}
                  <Link to="/">
                    <Button>Voltar para login</Button>
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}