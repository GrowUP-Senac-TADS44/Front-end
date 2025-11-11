import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import logoSgv from "../../assets/logo.svg";
import "./EmailSend.css";
import { CheckCircleIcon } from "@phosphor-icons/react";

export function EmailSend() {
  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center"
    >
      <Row>
        <Col>
          <Card className="card-email-send-style">
            <Card.Title className="d-flex align-items-center justify-content-center">
              <Image src={logoSgv} fluid />
            </Card.Title>
            <Card.Body className="mt-5" color="#000">
              <Row className="d-flex align-items-center justify-content-center">
                <Col md={9}>
                  <div className="mb-4 w-100 d-flex align-items-center">
                    <h4 className="m-0 me-3">E-mail enviado</h4>
                    <CheckCircleIcon
                      className="mt-1"
                      size={25}
                      color="#28a745"
                    />
                  </div>

                  <p className="text-secondary">
                    Verifique sua caixa de entrada (incluindo o Spam). O link de
                    redefinição expirará
                  </p>
                  <a href="">Reenviar email</a>
                </Col>
              </Row>
              <Row className="mt-5 d-flex align-items-center justify-content-end">
                <Col md={4}>
                  <Button href="/">Voltar para login</Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
