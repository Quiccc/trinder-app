import React from 'react';
import { Navbar, Container, Form, Button, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Search } from "react-bootstrap-icons";
import { Camera } from "react-bootstrap-icons";
import { GeoAltFill } from "react-bootstrap-icons";
import LoginComponent from "./loginComponent";
import "../styles.css";

function NavbarComponent() {

  return (
    <Navbar className="shadow p-3 mb-5 bg-body rounded">
      <Container>
        <div className="d-flex">
          <Navbar.Brand href="/">
            <img
              alt=""
              src="./images/Logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
          </Navbar.Brand>
          <Dropdown>
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
              <GeoAltFill className="align-baseline" /> Select Location
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>To Be Added</Dropdown.Item>
              <Dropdown.Item>To Be Added</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Form className="d-flex">
          <Form.Control type="text" placeholder="Search" />
          <Button variant="dark">
            <Search className="align-baseline" />
          </Button>
        </Form>
        <div>
          <LoginComponent /> {""}
          <Button variant="dark">
            <Camera className="align-top" size={25} /> New
          </Button>
        </div>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
