import React, { Component } from "react";
import { Carousel, Card, Button } from "react-bootstrap";
import { Github, Linkedin, FileRuledFill } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";
class HomeComponent extends Component {
  state = {};
  render() {
    return (
      <>
        <Carousel pause="hover" wrap="false">
          <Carousel.Item interval={5000} className="carouselStyle">
            <img
              className="d-block w-100"
              src="./images/CarouselPH1.jpg"
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={2500} className="carouselStyle">
            <img
              className="d-block w-100"
              src="./images/CarouselPH2.jpg"
              alt="Second slide"
            />
            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item className="carouselStyle">
            <img
              className="d-block w-100"
              src="./images/CarouselPH3.jpg"
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <div className="cardDiv">
          <Card className="cardStyle">
            <Card.Img
              variant="top"
              src="./images/CardPH.png"
              className="cardImg"
            />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text className="cardText">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
              <Button variant="dark" className="rounded-circle">Go</Button>
            </Card.Body>
          </Card>
          <Card className="cardStyle">
            <Card.Img
              variant="top"
              src="./images/CardPH.png"
              className="cardImg"
            />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text className="cardText">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
              <Button variant="dark" className="rounded-circle">Go</Button>
            </Card.Body>
          </Card>
          <Card className="cardStyle">
            <Card.Img
              variant="top"
              src="./images/CardPH.png"
              className="cardImg"
            />
            <Card.Body>
              <Card.Title>Card Title</Card.Title>
              <Card.Text className="cardText">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </Card.Text>
              <Button variant="dark" className="rounded-circle">Go</Button>
            </Card.Body>
          </Card>
        </div>
        <Card className="shadow-lg p-3 mb-5 bg-body rounded">
          <Card.Body className="cardDiv">
            <Button variant="dark" className="footerLink" href="https://github.com/Quiccc/trinder-app">
              <Github size={32} />
            </Button>
            <Button variant="dark" className="footerLink" href="https://www.linkedin.com/in/skagan4slan/">
              <Linkedin size={32} />
            </Button>
            <Button variant="dark" className="footerLink" href="https://trinder-6b720.web.app">
              <FileRuledFill size={32} />
            </Button>     
          </Card.Body>
          <p className="footerText">
            Trinder - 2023
          </p>
        </Card>
      </>
    );
  }
}

export default HomeComponent;
