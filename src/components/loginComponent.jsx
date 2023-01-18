import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import RegisterComponent from "./registerComponent";
import "../styles.css";

function LoginComponent() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="dark" onClick={handleShow}>
        Login
      </Button>

      <Modal className="login-modal" show={show} onHide={handleClose}>
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
            <p>Forgot your password? <a href="#">Reset your password</a></p>
            <p>Don't have an account?<RegisterComponent/></p>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginComponent;
