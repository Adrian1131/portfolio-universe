import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Routing components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ThreeScene from "./components/ThreeScene";
import About from "./pages/About"; // Component for the About page
import './styles/global.css'; // Global CSS for shared styles

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Main 3D Universe Page */}
        <Route
          path="/"
          element={
            <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
              {/* 3D Scene as Background */}
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: -1,
                }}
              >
                <ThreeScene />
              </div>

              {/* Main Content */}
              <main style={{ position: "relative", zIndex: 1 }}>
                <div
                  className="content-wrapper"
                  style={{
                    position: "absolute", // Fixed positioning
                    top: "15%", // Adjust vertical position
                    left: "5%", // Align to the left
                    maxWidth: "400px", // Limit width for better readability
                    zIndex: 2, // Ensure content sits above the 3D canvas
                    textAlign: "left",
                  }}
                >
                  <h1 style={{ fontSize: "2.5rem", margin: "20px 0" }}>Welcome to My Universe!</h1>
                  <p style={{ fontSize: "1.2rem", marginBottom: "15px" }}>
                    Explore the planets to learn more about me!
                  </p>
                  <p style={{ fontSize: "1rem", marginBottom: "30px" }}>
                    Click on a planet to discover something new.
                  </p>
                </div>
              </main>
              <Footer />
            </div>
          }
        />

        {/* About Page Route */}
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;