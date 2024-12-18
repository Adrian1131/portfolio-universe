import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ThreeScene from "./components/ThreeScene";
import './styles/global.css';

function App() {
  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
      {/* 3D Scene as Background */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}>
        <ThreeScene />
      </div>

      {/* Main Content */}
      <Navbar />
      <main style={{ position: "relative", zIndex: 1 }}>
        <div className="content-wrapper" style={{ textAlign: "center", padding: "20px" }}>
          <h1 style={{ fontSize: "2.5rem", margin: "20px 0" }}>Welcome to My Universe!</h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "15px" }}>
            Explore the planets to learn more about me!
          </p>
          <p style={{ fontSize: "1rem", marginBottom: "30px" }}>
            Click on a planet, any planet, to get started.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;

