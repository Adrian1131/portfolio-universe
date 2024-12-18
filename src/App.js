import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ThreeScene from "./components/ThreeScene";
import './styles/global.css';
function App() {
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <Navbar />
      <ThreeScene />
      <div style={{ position: "absolute", top: "10%", right: "10px", zIndex: 10 }}>
        
      </div>
      <Footer />
    </div>
  );
}

export default App;
