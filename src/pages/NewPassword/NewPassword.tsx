import {
  Container,
  Row,
  Col,
  Card,
  FormLabel,
  FormControl,
  Button,
  Form,
  Image
} from "react-bootstrap";
import logoSgv from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";

type Inputs = {
	senha1: string;
	senha2: string;
}

export function NewPassword() {

	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		watch
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = () => {
		navigate("/");
		watch();
	}
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
            <Card.Body className="mt-5">
              <h4 className="mb-4">Criar nova senha</h4>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="mb-4">
                  <Col>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl {...register("senha1")} type="password" placeholder="...." />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <FormLabel>Confirmar nova senha</FormLabel>
                    <FormControl {...register("senha2")} type="password" placeholder="...." />
                  </Col>
                </Row>
                <a href="/">Voltar para login</a>
                <Row>
                  <Col md={11} className="d-flex justify-content-end">
                    <Button
                      className="px-5"
                      as="input"
                      type="submit"
                      value={"Redefinir senha"}
					  size="sm"
                    />
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
