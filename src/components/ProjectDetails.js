import React from "react";

const ProjectDetails = ({ projectName, description, techStack, link }) => {
  return (
    <section style={styles.container}>
      <h2 style={styles.header}>{projectName}</h2>
      <p style={styles.description}>{description}</p>
      <h4 style={styles.subHeader}>Tech Stack:</h4>
      <p style={styles.techStack}>{techStack}</p>
      <a href={link} target="_blank" rel="noopener noreferrer" style={styles.link}>
        View Project
      </a>
    </section>
  );
};

const styles = {
  container: {
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    margin: "20px auto",
    maxWidth: "600px",
    textAlign: "center",
  },
  header: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "10px",
  },
  description: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "10px",
  },
  subHeader: {
    fontSize: "18px",
    color: "#333",
    marginTop: "10px",
  },
  techStack: {
    fontSize: "14px",
    color: "#777",
    marginBottom: "10px",
  },
  link: {
    textDecoration: "none",
    color: "#007BFF",
    fontWeight: "bold",
  },
};

export default ProjectDetails;