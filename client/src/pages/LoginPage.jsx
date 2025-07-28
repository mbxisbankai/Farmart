import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = React.useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    try {
      await login(values.email, values.password);
      navigate("/"); // Redirect to homepage
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <h3>Login to Your Account</h3>
              </Card.Title>

              {error && <Alert variant="danger">{error}</Alert>}

              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, touched, errors }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email address</label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
                      />
                      <ErrorMessage name="email" component="div" className="invalid-feedback" />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="password" className="form-label">Password</label>
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        className={`form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
                      />
                      <ErrorMessage name="password" component="div" className="invalid-feedback" />
                    </div>

                    <div className="d-grid mb-3">
                      <Button variant="primary" type="submit" disabled={isSubmitting} size="lg">
                        {isSubmitting ? "Logging in..." : "Login"}
                      </Button>
                    </div>

                    <div className="text-center">
                      <p className="mb-0">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-decoration-none">Register here</Link>
                      </p>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
