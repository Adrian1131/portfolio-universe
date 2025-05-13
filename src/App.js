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
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "90%",
                    maxWidth: "800px",
                    textAlign: "center",
                    background: "rgba(13, 17, 23, 0.7)",
                    backdropFilter: "blur(10px)",
                    padding: "2rem",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 0 30px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <h1 
                    style={{ 
                      fontSize: "3rem", 
                      margin: "0 0 1rem 0",
                      background: "linear-gradient(45deg, #fff, #8a2be2)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: "0 0 20px rgba(138, 43, 226, 0.3)"
                    }}
                  >
                    Welcome to My Universe!
                  </h1>
                  <p 
                    style={{ 
                      fontSize: "1.4rem", 
                      marginBottom: "1rem",
                      color: "#e1e1e1"
                    }}
                  >
                    Explore the planets to learn more about me!
                  </p>
                  <p 
                    style={{ 
                      fontSize: "1.1rem", 
                      marginBottom: "0",
                      color: "#b1b1b1"
                    }}
                  >
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