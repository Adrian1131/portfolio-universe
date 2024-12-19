import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link> {/* Redirects to the main home page */}</li>
        <li><Link to="/about">About This Project</Link></li>
        <li><a href="https://www.linkedin.com/in/adrianfswe/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        <li><a href="/resume" target="_blank" rel="noopener noreferrer">Resume</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;