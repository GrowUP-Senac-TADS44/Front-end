// src/pages/EmailAcessRecover/EmailAcessRecover.tsx
import { Button, Card, Col, Container, Form, FormControl, FormLabel, Image, Row } from "react-bootstrap";
import logoSgv from "../../assets/logo.svg";
import "./EmailAccessRecover.css";
import { useNavigate, Link } from "react-router-dom"; // Adicionado Link
import { useForm, type SubmitHandler } from "react-hook-form";

type Inputs = {
  email: string;
};

export function EmailAccessRecover() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = () => {
    // Redireciona para a rota correta definida no App.tsx
    navigate("/email-enviado"); 
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <Row>
        <Col>
          <Card className="card-email-access-recover-style">
            <Card.Title className="d-flex align-items-center justify-content-center">
              <Image src={logoSgv} fluid />
            </Card.Title>
            <Card.Body className="mt-5">
              <h4 className="mb-4">Recupere sua conta</h4>
              <p className="text-secondary">
                Informe seu e-mail para receber as instruções de recuperação.
              </p>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="mb-4">
                  <Col>
                    <FormLabel>Email</FormLabel>
                    <FormControl {...register("email")} type="email" placeholder="exemplo@email.com" />
                  </Col>
                </Row>
                
                {/* Link corrigido */}
                <Link to="/">Voltar para login</Link>

                <Row>
                  <Col md={10} className="d-flex justify-content-end">
                    <Button className="px-5 mt-3" as="input" type="submit" value={"Enviar"} />
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