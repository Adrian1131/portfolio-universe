import React from "react";

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li><a href="#about" style={styles.link}>About</a></li>
        <li><a href="#projects" style={styles.link}>Projects</a></li>
        <li><a href="#resume" style={styles.link}>Resume</a></li>
        <li><a href="#contact" style={styles.link}>Contact</a></li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.38)",
    padding: "10px 20px",
    zIndex: 1000,
  },
  navList: {
    display: "flex",
    justifyContent: "center",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    margin: "0 15px",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "color 0.3s",
  },
};

export default Navbar;