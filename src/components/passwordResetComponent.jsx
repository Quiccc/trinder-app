import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
function PasswordResetComponent() {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Reset Your Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Enter your email address to receive a link to reset your password.
        </p>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Email" />
          </Form.Group>
          <Button variant="dark" type="submit">
            Receive Recovery Code
          </Button>
        </Form>
      </Modal.Body>
    </>
  );
}

export default PasswordResetComponent;
