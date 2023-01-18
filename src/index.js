import React from "react";
import ReactDOM from "react-dom/client";
import HomeComponent from "./components/homeComponent";
import NavbarComponent from "./components/navbarComponent";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.Fragment>
    <NavbarComponent />
    <HomeComponent />
  </React.Fragment>
);
