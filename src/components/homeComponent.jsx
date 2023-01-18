import React, { Component } from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";
class HomeComponent extends Component {
  state = {};
  render() {
    return (
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
          <img className="d-block w-100" src="./images/CarouselPH2.jpg" alt="Second slide" />
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item className="carouselStyle">
          <img className="d-block w-100" src="./images/CarouselPH3.jpg" alt="Third slide" />
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
  }
}

export default HomeComponent;
