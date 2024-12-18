import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    textAlign: "center",
    padding: "10px 0",
    fontSize: "14px",
    zIndex: 1000,
  },
};

export default Footer;