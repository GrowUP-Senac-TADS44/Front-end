import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormLabel,
  Image,
  Row,
} from "react-bootstrap";
import logoSgv from "../../assets/logo.svg";
import "./Login.css";

export function Login() {
  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center"
    >
      <Row>
        <Col>
          <Card className="card-login-style">
            <Card.Title className="d-flex align-items-center justify-content-center">
              <Image src={logoSgv} fluid />
            </Card.Title>
            <Card.Body className="mt-5" color="#000">
              <h4 className="mb-4">Acesse sua conta</h4>
              <Form>
                <Row className="mb-4">
                  <Col>
                    <FormLabel>Email</FormLabel>
                    <FormControl type="email" placeholder="exemplo@email.com" />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <FormLabel>Email</FormLabel>
                    <FormControl type="password" placeholder="...." />
                  </Col>
                </Row>
                <a href="/">Esqueceu a senha?</a>
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
