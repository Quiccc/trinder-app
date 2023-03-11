import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import RegisterComponent from "./registerComponent";
import PasswordResetComponent from "./passwordResetComponent";
import "../styles.css";

function LoginComponent() {
  const [show, setShow] = useState(false); // Modal state
  const [content, setContent] = useState("login"); // Modal content state

  // Modal state functions
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setContent("login");
  };

  // Modal content state function
  const loadRegister = () => setContent("register");
  const loadPasswordReset = () => setContent("passwordReset");

  return (
    <>
      {/* Button for rendering login component */}
      <Button variant="dark" onClick={handleShow}>
        Login
      </Button>

      <Modal className="login-modal" show={show} onHide={handleClose}>
        {/* Conditional rendering for login, register and password reset components */}
        {content === "login" ? (
          /* Login component */
          <div>
            <Modal.Header closeButton>
              <Modal.Title>Login to your Trinder account.</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Remember Me" />
                </Form.Group>
                <Button variant="dark" type="submit">
                  Sign In
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer className="login-footer">
              <p>
                Forgot your password?{" "}
                <Button variant="link" onClick={loadPasswordReset}>
                  Reset your password here
                </Button>
              </p>
              <p>
                Don't have an account?{" "}
                <Button variant="link" onClick={loadRegister}>
                  Create an account here
                </Button>
              </p>
            </Modal.Footer>
          </div>
        ) : content === "register" ? (
          /* Render register component */
          <RegisterComponent />
        ) : (
          /* Render password reset component */
          <PasswordResetComponent />
        )}
      </Modal>
    </>
  );
}

export default LoginComponent;
