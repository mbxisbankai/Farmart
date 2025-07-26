import React from "react";
import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-dark text-white py-3 mt-auto">
      <Container className="text-center">
        <small>&copy; {new Date().getFullYear()} Farmart. All rights reserved.</small>
      </Container>
    </footer>
  );
}

export default Footer;
