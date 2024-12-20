// About.js
import React from "react";
import '../styles/about.css'; // Optional for styling

const About = () => {
  return (
    <div className="about-container">
      <h1>About This Project</h1>
      <p>
        Welcome to my 3D universe! This project was built using <strong>React</strong>, <strong>Three.js</strong>, and <strong>CSS</strong>, and it aims to showcase my technical expertise, creativity, and passion for interactive user experiences.
      </p>
      <h2>Project Overview</h2>
      <p>
        The goal of this project is to create an immersive portfolio that allows users to explore various aspects of my professional journey in a unique and engaging way. Each planet represents a different part of my career, skills, or personal background, making this portfolio both informative and interactive.
      </p>
      <p>
        The project highlights my interests in backend development, database engineering, and data-driven solutions while providing a visually captivating experience.
      </p>

      <h2>Key Technologies Used</h2>
      <ul>
        <li><strong>React:</strong> User interface and component-based design</li>
        <li><strong>Three.js:</strong> 3D rendering and planet animations</li>
        <li><strong>GSAP:</strong> Smooth animations for zooming, transitions, and camera control</li>
        <li><strong>CSS:</strong> Custom styling to enhance visuals and maintain responsive design</li>
        <li><strong>React Router:</strong> Navigation between pages like "Home" and "About This Project"</li>
      </ul>

      <h2>Features Implemented</h2>
      <p>This project includes the following features:</p>
      <ul>
        <li>Interactive 3D planets orbiting a central Sun</li>
        <li>Clickable planets that zoom in and display detailed cards with custom information</li>
        <li>Responsive design to ensure compatibility across devices</li>
        <li>A dedicated "About This Project" page describing the project’s purpose, technologies, and features</li>
        <li>Smooth animations powered by GSAP for a professional user experience</li>
      </ul>

      <h2>Challenges Faced</h2>
      <p>
        Throughout the development process, I encountered and overcame several challenges:
      </p>
      <ul>
        <li>Managing 3D object interactions and camera movements using Three.js and GSAP</li>
        <li>Implementing React Router for seamless page transitions</li>
        <li>Resolving layout and styling issues to ensure responsiveness and accessibility</li>
        <li>Organizing project data effectively in external files like <code>cardsData.js</code></li>
      </ul>

      <h2>Future Enhancements</h2>
      <p>
        While the project already includes a variety of features, there’s always room for improvement. Planned future enhancements include:
      </p>
      <ul>
        <li>Adding a backend system for dynamic content management</li>
        <li>Implementing a contact form with email functionality</li>
        <li>Enhancing the 3D environment with advanced visual effects like shaders</li>
        <li>Incorporating dynamic data fetching from APIs or databases</li>
        <li>Adding animations for transitioning between pages</li>
      </ul>

      <h2>Conclusion</h2>
      <p>
        This project has been an exciting journey in combining my technical skills with creativity to produce an innovative portfolio. I am constantly looking for ways to improve and expand upon this project to showcase my growth as a developer.
      </p>
      <p>
        Thank you for exploring! Feel free to click on planets to learn more or reach out through the contact section in the navbar.
      </p>
    </div>
  );
};

export default About;
